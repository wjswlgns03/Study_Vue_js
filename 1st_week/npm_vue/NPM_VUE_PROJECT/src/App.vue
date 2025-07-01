<script>
export default {
  // 1. 데이터 정의: 컴포넌트의 상태를 관리합니다.
  //    각 데이터의 역할과 초기값을 명확히 설명합니다.
  data() {
    return {
      number: 0,              // 카운터 값 (증가/감소 버튼으로 조작)
      name: '철수',           // 사용자 이름
      gender: '남자',         // 사용자 성별
      age: 10,                // 사용자 나이
      inputMessage: '',       // 최종 확정된(Enter 입력 후) 메시지
      tempInputMessage: '',   // input 필드에 현재 입력 중인 임시 메시지 (실시간 반영)
      // isComposing은 v-model 사용 시 대부분 자동으로 처리되므로 제거했습니다.
    };
  },

  // 2. 계산된 속성 (Computed Properties):
  //    기존 데이터를 기반으로 새로운 데이터를 파생시키거나, 복잡한 로직의 결과를 캐싱할 때 사용합니다.
  computed: {
    // 나이에 따라 '성인' 또는 '미성년자' 상태를 반환합니다.
    ageStatus() {
      return this.age >= 18 ? '성인' : '미성년자';
    },
    // 현재 입력 중인 임시 메시지(tempInputMessage)의 유효성 (비어있는지 여부)을 계산합니다.
    // 이 값은 tempInputMessage가 변경될 때마다 자동으로 업데이트되어 실시간 피드백을 제공합니다.
    isTempInputMessageValid() {
      return this.tempInputMessage.trim() !== '';
    }
  },

  // 3. 메서드 (Methods):
  //    컴포넌트 내에서 특정 동작을 수행하는 함수들을 정의합니다.
  methods: {
    // 버튼 클릭 이벤트를 처리하고 사용자 정의 메시지를 표시합니다.
    clickHandler(event, message) {
      alert(`${message}! 버튼이 클릭되었습니다.`);
      console.log('버튼 이벤트:', event); // 디버깅을 위한 콘솔 로그
    },

    // 입력 필드에서 Enter 키를 눌렀을 때의 동작을 처리합니다.
    // 임시 메시지(tempInputMessage)를 최종 메시지(inputMessage)로 확정하고 유효성을 검사합니다.
    onEnterKeyHandler() {
      // 먼저 임시 메시지를 최종 메시지로 확정합니다.
      this.inputMessage = this.tempInputMessage;

      // 확정된 메시지의 유효성을 검사합니다.
      if (!this.isTempInputMessageValid) { // 유효성 검사는 tempInputMessage 기준으로 수행
        alert('메시지를 입력해주세요!');
        return;
      }
      console.log('메시지와 함께 Enter 키 눌림:', this.inputMessage);
      alert(`입력된 메시지: ${this.inputMessage}`);
      // Enter 후 입력 필드를 비우고 싶다면 아래 주석 해제
      // this.tempInputMessage = '';
    },

    // 카운터 값을 1 증가시킵니다.
    increment() {
      this.number++;
    },

    // 카운터 값을 1 감소시킵니다. (0 미만으로는 내려가지 않음)
    decrement() {
      this.number > 0 ? this.number-- : this.number;
    },

    // 모든 컴포넌트의 데이터를 초기 상태로 재설정합니다.
    resetForm() {
      this.number = 0;
      this.name = '철수';
      this.gender = '남자';
      this.age = 20;
      this.inputMessage = '';
      this.tempInputMessage = ''; // 임시 메시지도 초기화
      alert('모든 값이 초기화되었습니다!');
    }
  }
}
</script>

<template>
  <div>
    <!-- 카운터 섹션: 숫자 증가/감소 기능을 제공합니다. -->
    <section class="counter-section">
      <h1>현재 숫자: {{ number }}</h1>
      <button @click="increment" v-once>증가</button>
      <button @click="decrement" v-once>감소</button>
    </section>

    <!-- 입력 섹션: 사용자 메시지 입력 및 유효성 검사를 처리합니다. -->
    <section class="input-section">
      <!-- v-model로 현재 입력 중인 값을 tempInputMessage에 바인딩합니다. -->
      <!-- v-model은 한글 조합 입력(composition)도 자동으로 잘 처리해줍니다. -->
      <input
        type="text"
        v-model="tempInputMessage"
        @keyup.enter="onEnterKeyHandler"
        placeholder="메시지를 입력 후 Enter"
      />
      <!-- 입력 유효성 검사 결과에 따라 경고 메시지를 표시합니다.
           현재 입력 중인 값(tempInputMessage)을 기준으로 유효성을 검사하여 실시간 피드백 제공 -->
      <p v-if="!isTempInputMessageValid" class="warning-message">메시지를 입력해주세요!</p>
      <!-- 최종 확정된 메시지(inputMessage)를 표시합니다. -->
      <p class="current-message">확정된 메시지: {{ inputMessage || '아직 확정된 내용이 없습니다.' }}</p>
      <button @click="clickHandler($event, '환영합니다')" v-once>클릭 테스트</button>
    </section>

    <!-- 프로필 섹션: 사용자 정보를 표시하고 수정합니다. -->
    <!-- v-memo를 사용하여 name, gender가 변경될 때만 이 섹션을 업데이트합니다. -->
    <section class="profile-section" v-memo="[name, gender, age]">
      <p><span v-once>이름:</span> {{ name }}</p>
      <p><span v-once>성별:</span> {{ gender }}</p>
      <p><span v-once>나이:</span> {{ age }} ({{ ageStatus }})</p>
      <div class="profile-actions">
        <button @click="name = '영희'">이름 변경</button>
        <button @click="gender = '여자'">성별 변경</button>
        <button @click="age = 30">나이 변경</button>
      </div>
    </section>

    <!-- 전체 초기화 버튼: 모든 데이터를 초기 상태로 되돌립니다. -->
    <button @click="resetForm" class="reset-button" v-once>모든 값 초기화</button>
  </div>
</template>

<style>

</style>