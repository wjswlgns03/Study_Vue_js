import { computed } from 'vue';
import { state } from './state';

/**
 * 계산기의 출력 값을 표시하기 위한 계산된 속성
 * @returns {string} 계산기 화면에 표시할 출력 문자열
 */
export const displayOutput = computed(() =>
    state.cur
        ? `${state.expression}${state.expression ? ' ' : ''}${state.cur}`
        : state.expression || state.output || '0'
);

/**
 * 수식을 평가하여 계산 결과를 상태에 반영
 * @throws {Error} 잘못된 수식, 숫자 형식, 0으로 나누기 등 오류 발생 시
 */
export const calculate = () => {
    // 입력이 없는 경우 종료
    if (!state.expression && !state.cur) return;

    try {
        // 최종 평가할 수식 문자열 준비
        let finalExpression = state.expression;
        if (state.cur) {
            finalExpression += (finalExpression ? ' ' : '') + state.cur;
        }

        // 수식을 공백 기준으로 분리하고, 빈 문자열 토큰은 제거
        const tokens = finalExpression.split(' ').filter(Boolean);
        if (!tokens.length) return;

        // 수식이 연산자로 끝나는 경우 처리
        if (['+', '-', '*', '/'].includes(tokens[tokens.length - 1])) {

            // 연산자 앞에 숫자가 있다면, 해당 숫자까지만 결과로 처리
            if (tokens.length > 1 && !isNaN(parseFloat(tokens[tokens.length - 2]))) {
                state.output = parseFloat(tokens[tokens.length - 2]).toString();
                state.prev = state.output;
                state.cur = '';
                state.operator = null;
                state.expression = state.output;
                return;
            } else {
                throw new Error('불완전한 수식입니다.');
            }
        }

        // 토큰을 숫자와 연산자로 분리 (기존 로직 유지)
        const numbers: number[] = [];
        const operators: string[] = [];
        for (let i = 0; i < tokens.length; i++) {
            if (i % 2 === 0) {
                const num = parseFloat(tokens[i]);
                if (isNaN(num)) throw new Error('잘못된 숫자 형식입니다.');
                numbers.push(num);
            } else {
                if (!['+', '-', '*', '/'].includes(tokens[i])) {
                    throw new Error('잘못된 연산자입니다.');
                }
                operators.push(tokens[i]);
            }
        }

        // 높은 우선순위 연산 처리 (곱셈, 나눗셈)
        const { numbers: processedNumbers, operators: processedOperators } = HighPrecOps(numbers, operators);

        // 낮은 우선순위 연산 처리 (덧셈, 뺄셈)
        let finalResult = LowPrecOps(processedNumbers, processedOperators);

        // 결과가 유한한 숫자인지 확인하여 무한대 또는 NaN을 방지
        if (!isFinite(finalResult)) throw new Error('범위를 벗어난 결과입니다.');
        
        // 부동 소수점 오차를 줄이기 위해 결과를 소수점 8자리로 반올림
        finalResult = Number(finalResult.toFixed(8));
        state.output = finalResult.toString();
        state.prev = finalResult.toString();
        state.cur = '';
        state.operator = null;
        state.expression = finalResult.toString();
    } catch (error) {
        state.output = error instanceof Error ? error.message : 'Error';
        clear(); 
    }
};

/**
 * 숫자 배열과 연산자 배열을 받아 곱셈과 나눗셈을 먼저 처리
 * @param {number[]} numbers - 현재 숫자 배열
 * @param {string[]} operators - 현재 연산자 배열
 * @returns {{ numbers: number[], operators: string[] }} - 곱셈/나눗셈 처리 후의 숫자 및 연산자 배열
 * @throws {Error} 0으로 나누기 시 오류 발생
 */
const HighPrecOps = (numbers: number[], operators: string[]): { numbers: number[], operators: string[] } => {
    // 원본 배열을 수정하지 않도록 복사본 생성
    let resultNumbers = [...numbers];       // 계산 중 숫자 배열
    let resultOperators = [...operators];   // 계산 중 연산자 배열

    // 곱셈과 나눗셈 연산 정보 배열 (높은 우선순위 연산자)
    const highPrecedenceOps: { index: number; op: string }[] = [];
    for (let i = 0; i < resultOperators.length; i++) {
        if (resultOperators[i] === '*' || resultOperators[i] === '/') {
            highPrecedenceOps.push({ index: i, op: resultOperators[i] });
        }
    }

    // 높은 우선순위 연산자를 역순으로 정렬하여, 배열에서 요소를 제거할 때 인덱스 오류를 방지
    highPrecedenceOps.sort((a, b) => b.index - a.index);

    // 곱셈과 나눗셈을 먼저 처리 ( 배열을 직접 수정하여 결과를 반영 )
    for (const { index, op } of highPrecedenceOps) {
        const num1 = resultNumbers[index];
        const num2 = resultNumbers[index + 1];
        let result: number;

        if (op === '*') {
            result = num1 * num2;
        } else { // op === '/'
            if (num2 === 0) {
                throw new Error('0으로 나누기는 할 수 없습니다.');
            }
            result = num1 / num2;
        }

        // 계산된 결과로 두 숫자와 해당 연산자를 대체
        resultNumbers.splice(index, 2, result);
        resultOperators.splice(index, 1);
    }

    return { numbers: resultNumbers, operators: resultOperators };
};

/**
 * 숫자 배열과 연산자 배열을 받아 덧셈과 뺄셈을 순서대로 처리하여 최종 결과를 계산
 * @param {number[]} numbers - 높은 우선순위 연산 처리 후의 숫자 배열 (첫 번째 요소가 시작 값)
 * @param {string[]} operators - 높은 우선순위 연산 처리 후의 연산자 배열
 * @returns {number} - 최종 계산 결과
 */
const LowPrecOps = (numbers: number[], operators: string[]): number => {
    if (numbers.length === 0) {
        return 0; // 숫자가 없으면 0 반환 (예외 처리 필요 시 수정)
    }

    let finalResult = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const num = numbers[i + 1];
        const op = operators[i];

        if (op === '+') {
            finalResult += num;
        } else if (op === '-') {
            finalResult -= num;
        }
    }
    return finalResult;
};



/**
 * 계산기 상태를 초기화
 */
export const clear = () => {
    Object.assign(state, {
        output: '',
        prev: null,
        cur: '',
        operator: null,
        expression: '',
    });
};

/**
 * 사용자가 입력한 값을 현재 입력값에 추가
 * @param {string} value - 사용자가 입력한 값 (숫자 또는 소수점)
 */
export const userInput = (value: string) => {
    if (state.output && state.prev && !state.operator && !state.cur) {
        clear();
    }

    // 입력 길이 제한 및 중복 소수점, 0 처리
    if (state.cur.length >= 15 && value !== '.') return;
    if (value === '.' && state.cur.includes('.')) return;
    if (value === '0' && state.cur === '0') return;

    state.cur = state.cur === '' && value !== '.' && value !== '0' ? value : state.cur + value;
};

/**
 * 연산자 입력을 처리하고 수식을 업데이트
 * @param {string} op - 입력된 연산자 (+, -, *, /, =, sq)
 */
export const operation = (op: string) => {
    // 1. 유효성 검사: 입력된 연산자가 유효한 연산자 목록에 포함되는지 확인
    if (!['+', '-', '*', '/', '=', 'sq'].includes(op)) return;

    // 2. 단항 연산자 (sq) 처리
    if (op === 'sq') {
        if (!state.cur && !state.prev) return; // 입력값이 없으면 아무 작업도 하지 않음

        let num: number;
        if (state.cur) {
            num = parseFloat(state.cur);
        } else if (state.prev) {
            num = parseFloat(state.prev);
        } else {
            return;
        }

        if (isNaN(num)) throw new Error('잘못된 숫자 형식입니다.');

        let result: number = num * num;

        // 부동 소수점 오차를 줄이기 위해 결과를 소수점 8자리로 반올림
        result = Number(result.toFixed(8));

        // 계산 기록에 추가
        const calcExpression = `sq(${state.cur || state.prev})`;
        if (state.history.length >= 10) state.history.shift();
        state.history.push(`${calcExpression} = ${result}`);

        // 상태 업데이트
        state.output = result.toString();
        state.prev = result.toString();
        state.cur = '';
        state.operator = null;
        state.expression = result.toString();
        return;
    }

    // 3. 초기 상태 검사: 현재 입력값과 이전 값이 모두 비어있고 연산자가 '='가 아닌 경우 아무 작업도 하지 않음
    if (!state.cur && !state.prev && op !== '=') return;

    // 4. '=' 연산자 처리 로직
    if (op === '=') {
        if (state.cur || state.expression) {
            // 계산할 최종 수식
            const calcExpression = `${state.expression}${state.expression ? ' ' : ''}${state.cur ? state.cur + ' ' : ''}`;
            calculate();
            
            // 계산된 수식에 실제 연산자(+, -, *, /)가 포함되어 있는지 정규식을 통해 확인
            if (/[+\-*/]/.test(calcExpression)) {
                // 계산 기록의 길이가 10개를 초과하는 경우, 가장 오래된 기록을 배열의 앞에서 제거
                if (state.history.length >= 10) state.history.shift();
                state.history.push(`${calcExpression}= ${state.output}`);
            }
        }
    } 
    // 5. 그 외 로직
    else {
        // 현재 숫자나 연산자가 없는 상태에서 새로운 연산자가 입력될 경우
        if (state.output && state.prev && !state.cur && !state.operator) {
            state.expression = `${state.output} ${op}`;
            state.prev = null;
            state.operator = op;
            return;
        }
        // 현재 숫자가 입력된 상태에서 새로운 연산자가 입력될 경우
        if (state.cur) {
            state.expression += `${state.expression ? ' ' : ''}${state.cur} ${op}`;
            state.cur = '';
            state.operator = op;
        } 
        // 현재 숫자는 없지만, 이미 연산자가 입력되어 있고 이전 숫자가 있는 경우
        else if (state.operator && state.prev) {
            state.expression = state.expression.slice(0, -1) + op;
            state.operator = op;
        }
    }
};

/**
 * 계산 기록에서 특정 항목을 선택하여 상태를 업데이트
 * @param {string} item - 계산 기록 문자열
 */
export const selectHistory = (item: string) => {
    // 선택한 기록의 결과값
    const result = item.split('=').pop()?.trim() || '';
    state.output = result;
    state.expression = result;
    state.cur = '';
    state.showHistory = false;
};