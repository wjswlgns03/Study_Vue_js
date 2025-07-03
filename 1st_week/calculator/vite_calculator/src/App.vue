<template>
  <div class="calculator">

    <!-- 계산기 화면 (처음 웹사이트가 렌더링 되면 보이는 화면) -->
    <!-- 계산 기록 버튼을 누르면 화면 전환이 되도록 만들기 위해 v-if 사용 -->
    <form name="forms" v-if="!showHistory">

      <!-- 한국어, 영어, ... 문자를 입력할 때 v-bind:value와 v-on:input를 직접 연결 안하면 연결 지연, 중복 입력 문제가 발생할 수 있다고 함 -->
      <input type="text" v-model="displayOutput" readonly />
      <input type="button" class="clear" value="C" @click="clear" />
      <input type="button" class="operator" value="/" @click="operation('/')" />
      <input type="button" value="1" @click="userInput('1')" />
      <input type="button" value="2" @click="userInput('2')" />
      <input type="button" value="3" @click="userInput('3')" />
      <input type="button" class="operator" value="*" @click="operation('*')" />
      <input type="button" value="4" @click="userInput('4')" />
      <input type="button" value="5" @click="userInput('5')" />
      <input type="button" value="6" @click="userInput('6')" />
      <input type="button" class="operator" value="+" @click="operation('+')" />
      <input type="button" value="7" @click="userInput('7')" />
      <input type="button" value="8" @click="userInput('8')" />
      <input type="button" value="9" @click="userInput('9')" />
      <input type="button" class="operator" value="-" @click="operation('-')" />
      <input type="button" class="dot" value="." @click="userInput('.')" />
      <input type="button" value="0" @click="userInput('0')" />
      <input type="button" class="operator result" value="=" @click="operation('=')" />
    </form>

    <!-- 계산 기록 버튼 -->
    <form name="result-form" v-if="!showHistory">
      <input type="button" class="history" value="계산 기록 (단축키: h)" @click="showHistory = true" />      
    </form>

    <!-- 다크모드 버튼 -->
    <form name="result-form" v-if="!showHistory">
      <input type="button" class="dark-mode" :value="isDarkMode ? '밝은 배경 (단축키: d)' : '어두운 배경 (단축키: d)'" @click="ch_BG_Color" />
    </form>
    
    <!-- 계산 기록 화면 (계산 기록 버튼을 누르면 전환되는 화면) -->
    <div v-if="showHistory" class="history-view">
      <h3>계산 기록</h3>
      <div class="history-list-wrap">
        <ul class="history-list">
          <!-- html에 반복되는 부분을 v-for로 처리 -->
          <li v-for="(item, index) in history" :key="index" @click="selectHistory(item)">
            {{ item }}  <!-- 계산 기록은 10개까지 확인 가능 -->
          </li>
        </ul>
      </div>
      <button class="history-back-btn" @click="showHistory = false">뒤로가기 (단축키: esc)</button>
    </div>
  </div>
</template>






<script lang="ts">

import { defineComponent } from 'vue';
import { stateRefs } from './components/state';
import { displayOutput, calculate, clear, userInput, operation, selectHistory } from './components/calculator';
import { ch_BG_Color } from './components/darkMode';
import { setupKeyboard } from './components/keyboard';

export default defineComponent({
  name: 'Calculator',
  setup() {
    
    // 반응형 상태 정의(계산기 데이터)
    // 공부해야 될 점
    // reactive는 객체 자체를 반응형으로 만드는데 
    // Vue가 반응성 추적 및 트리거링을 위해 반응성 객체의 모든 속성에 대한 액세스 및 변형을 가로챌 수 있음
    const state = reactive({
      /** 계산 결과를 표시하는 문자열 */
      output: '',

      /** 이전 계산 결과 또는 입력된 값을 저장 (null 가능) */
      prev: null as string | null,

      /** 현재 입력 중인 숫자 또는 소수점 문자열 */
      cur: '',

      /** 현재 선택된 연산자 (+, -, *, /) 또는 null */
      operator: null as string | null,

      /** 현재 계산 수식 (예: '5 + 3') */
      expression: '',

      /** 계산 기록을 저장하는 배열 (최대 10개 항목) */
      history: [] as string[],

      /** 계산 기록 화면의 표시 여부를 결정하는 플래그 */
      showHistory: false,
    });



    /**
     * 현재 입력값, 수식, 또는 결과값을 기반으로 동적으로 화면에 표시할 문자열 결정
     * @returns {string} 화면에 표시할 문자열 (기본값 '0')
     */
    const displayOutput = computed(() =>
      state.cur
        ? `${state.expression}${state.expression ? ' ' : ''}${state.cur}`
        : state.expression || state.output || '0'
    );



    /**
     * 수식을 계산하고 결과를 상태에 반영
     * @throws {Error} 잘못된 숫자, 0으로 나누기, 유효하지 않은 연산자 등
     */
    const calculate = () => {
      // 입력값 또는 수식이 없으면 계산하지 않음
      if (!state.expression && !state.cur) return;

      try {
        // 최종 수식 구성: 기존 수식과 현재 입력값 결합
        let finalExpression = state.expression;
        if (state.cur) {
          finalExpression += (finalExpression ? ' ' : '') + state.cur;
        }

        // 수식을 공백 기준으로 분리하여 토큰화
        const tokens = finalExpression.split(' ').filter(Boolean);
        if (!tokens.length) return;

        // Separate numbers and operators
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

        // 우선순위가 높은 연산자(*, /)를 먼저 처리
        const highPrecedence: { index: number; op: string }[] = [];
        for (let i = 0; i < operators.length; i++) {
          if (operators[i] === '*' || operators[i] === '/') {
            highPrecedence.push({ index: i, op: operators[i] });
          }
        }

        // 인덱스를 유지 => 오른쪽에서 왼쪽으로 처리하기 위해 내림차순으로 정렬
        highPrecedence.sort((a, b) => b.index - a.index);

        let resultNumbers = [...numbers];
        let resultOperators = [...operators];

        // 우선순위가 높은 작업 수행
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
          // 결과로 변경
          resultNumbers.splice(index, 2, result);
          // 연산자 제거
          resultOperators.splice(index, 1);
        }

        // 우선순위가 낮은 연산자(+, -) 처리
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

		// 계산 결과가 유한하지 않으면 예외 처리
        if (!isFinite(finalResult)) throw new Error('범위를 벗어난 결과입니다.');
		
		// 소수점 8자리까지 반올림하여 결과 저장
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
     * 모든 값을 기본값으로 재설정
     */
    const clear = () => {
      Object.assign(state, {
        output: '',
        prev: null,
        cur: '',
        operator: null,
        expression: '',
      });
    };

    /**
     * 숫자 or 소수점을 처리, 유효성을 확인하고 현재 입력값에 추가
     * @param {string} value - 입력된 값 (숫자 또는 소수점)
     */
    const userInput = (value: string) => {
      // 이전 결과가 있고 새 연산이 시작되지 않은 경우 초기화
      if (state.output && state.prev && !state.operator && !state.cur) {
        clear();
      }

      // 입력값 길이 제한 (최대 15자: 갤럭시 스마트폰 기준)
      if (state.cur.length >= 15 && value !== '.') return;
      // 중복 소수점 입력 방지
      if (value === '.' && state.cur.includes('.')) return;
      // 연속된 0 입력 방지
      if (value === '0' && state.cur === '0') return;

      // 입력값을 현재 값에 추가
      state.cur = state.cur === '' && value !== '.' && value !== '0' ? value : state.cur + value;
    };

    /**
     * 연산자(+, -, *, /) 또는 등호(=)를 처리
     * @param {string} op - 입력된 연산자 또는 등호
     */
    const operation = (op: string) => {
      
      // 유효한 연산자인지 확인
      if (!['+', '-', '*', '/', '='].includes(op)) return;
      // 입력값 또는 이전 값이 없으면 등호 외의 연산 무시
      if (!state.cur && !state.prev && op !== '=') return;

      if (op === '=') {
		// 등호 입력 시 계산 수행 및 기록 저장
        if (state.cur || state.expression) {
          const calcExpression = `${state.expression}${state.expression ? ' ' : ''}${state.cur ? state.cur + ' ' : ''}`;
          calculate();
          
		  // 계산 기록에 추가 (최대 10개 유지)
          if (/[+\-*/]/.test(calcExpression)) {
            if (state.history.length >= 10) state.history.shift();
            state.history.push(`${calcExpression}= ${state.output}`);
          }
        }
      } else {
		// 연산자 입력 시 수식 업데이트
        if (state.output && state.prev && !state.cur && !state.operator) {
          state.expression = `${state.output} ${op}`;
          state.prev = null;
          state.operator = op;
          return;
        }
		// 현재 입력값이 있으면 수식에 추
        if (state.cur) {
          state.expression += `${state.expression ? ' ' : ''}${state.cur} ${op}`;
          state.cur = '';
          state.operator = op;
        } else if (state.operator && state.prev) {
		  // 연산자 변경 처리
          state.expression = state.expression.slice(0, -1) + op;
          state.operator = op;
        }
      }
    };


    /**
     * 기록된 수식의 결과를 현재 출력값으로 설정
     * @param {string} item - 선택된 계산 기록 항목 (예: '5 + 3 = 8')
     */
    const selectHistory = (item: string) => {
      const result = item.split('=').pop()?.trim() || '';
      state.output = result;
      state.expression = result;
      state.cur = '';
      state.showHistory = false;
    };

	// 상태와 메서드를 반환하여 템플릿에서 사용 가능하도록 설정
    return {
      ...stateRefs,   // 상태 관리 객체에서 필요한 속성들
      displayOutput,  // 계산기 화면에 출력되는 값
      calculate,      // 계산 함수
      clear,          // 계산기 화면에 출력되는 값
      userInput,      // 사용자 입력 처리 함수
      operation,      // 연산 버튼 클릭 시 호출되는 함수
      selectHistory,  // 계산 기록을 선택하면 결과값을 입력창에 반영
      ch_BG_Color,    // 배경색 변경
    };
  },
});
</script>




<style scoped>
@import './App.css';
</style>

