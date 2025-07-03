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
        // 최종 평가할 수식 문자열
        let finalExpression = state.expression;
        if (state.cur) {
            finalExpression += (finalExpression ? ' ' : '') + state.cur;
        }

        // 수식을 공백 기준으로 분리하고, 빈 문자열 토큰은 제거
        const tokens = finalExpression.split(' ').filter(Boolean);
        if (!tokens.length) return;

        // 수식이 연산자로 끝나는 경우 처리
        if (['+', '-', '*', '/'].includes(tokens[tokens.length - 1])) {
            
            // 연산자 앞에 숫자가 있다면, 해당 숫자까지만 결과로 처리합니다.
            if (tokens.length > 1 && !isNaN(parseFloat(tokens[tokens.length - 2]))) {
                state.output = parseFloat(tokens[tokens.length - 2]).toString();
                state.prev = state.output;
                state.cur = '';
                state.operator = null;
                state.expression = state.output;
                return;
            } else {
                // 연산자 앞에 유효한 숫자가 없으면 에러
                throw new Error('불완전한 수식입니다.');
            }
        }

        const numbers: number[] = [];       // 숫자들을 저장하는 배열
        const operators: string[] = [];     // 연산자들을 저장하는 배열
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

        // 곱셈과 나눗셈 연산 정보 배열 (높은 우선순위 연산자)
        const highPrecedence: { index: number; op: string }[] = [];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '*' || operators[i] === '/') {
                highPrecedence.push({ index: i, op: operators[i] });
            }
        }

        // 높은 우선순위 연산자를 역순으로 정렬하여, 배열에서 요소를 제거할 때 인덱스 오류를 방지
        highPrecedence.sort((a, b) => b.index - a.index);

        let resultNumbers = [...numbers];       // 계산 중 숫자 배열
        let resultOperators = [...operators];   // 계산 중 연산자 배열

        // 곱셈과 나눗셈을 먼저 처리
        // 배열을 직접 수정하여 결과를 반영
        for (const { index, op } of highPrecedence) {
            const num1 = resultNumbers[index];
            const num2 = resultNumbers[index + 1];
            let result: number;
            if (op === '*') {
                result = num1 * num2;
            } else {
                if (num2 === 0) throw new Error('0으로 나누기는 할 수 없습니다.');
                result = num1 / num2;
            }

            // 계산된 결과로 두 숫자와 해당 연산자를 대체
            resultNumbers.splice(index, 2, result);
            resultOperators.splice(index, 1);
        }

        // 남은 덧셈과 뺄셈을 순서대로 처리하여 최종 결과를 계산
        let finalResult = resultNumbers[0];
        for (let i = 0; i < resultOperators.length; i++) {
            const num = resultNumbers[i + 1];
            const op = resultOperators[i];
            if (op === '+') {
                finalResult += num;
            } else if (op === '-') {
                finalResult -= num;
            }
        }

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
 * @param {string} op - 입력된 연산자 (+, -, *, /, =)
 */
export const operation = (op: string) => {
    // 1. 유효성 검사: 입력된 연산자가 유효한 연산자 목록에 포함되는지 확인
    // 2. 초기 상태 검사: 현재 입력값과 이전 값이 모두 비어있고 연산자가 '='가 아닌 경우 아무 작업도 하지 않음
    if (!['+', '-', '*', '/', '='].includes(op)) return;
    if (!state.cur && !state.prev && op !== '=') return;

    // 3. '=' 연산자 처리 로직
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
    // 4. '='을 제외한 다른 연산자(+, -, *, /) 처리 로직
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