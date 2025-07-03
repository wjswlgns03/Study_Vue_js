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
    setupKeyboard();  // 키보드 이벤트

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

