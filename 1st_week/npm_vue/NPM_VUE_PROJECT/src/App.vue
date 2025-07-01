<script>
export default {
  // 1. 데이터 정의: 컴포넌트의 상태를 관리
  data() {
    return {
      number: 0,              // 카운터 값 (증가/감소 버튼으로 조작)
      name: '철수',           // 사용자 이름
      gender: '남자',         // 사용자 성별
      age: 10,                // 사용자 나이
      message: '',            // 입력 메시지 (실시간 반영)
    };
  },

  // 2. 계산된 속성 (Computed Properties):
  computed: {
    // 나이에 따라 '성인' 또는 '미성년자' 상태를 반환
    ageStatus() {
      return this.age >= 18 ? '성인' : '미성년자';
    },
    // 입력 메시지의 유효성 (비어있는지 여부)을 계산
    isMessageValid() {
      return this.message.trim() !== '';
    }
  },

  // 3. 메서드 (Methods):
  methods: {
    // 버튼 클릭 이벤트를 처리하고 사용자 정의 메시지를 표시
    clickHandler(event, message) {
      alert(`${message}! 버튼이 클릭되었습니다.`);
      console.log('버튼 이벤트:', event);
    },

    // 입력 필드에서 실시간 입력을 처리
    onChangeHandler(event) {
      this.message = event.target.value;
      console.log('입력된 메시지:', this.message);
    },

    // 카운터 값을 1 증가
    increment() {
      this.number++;
    },

    // 카운터 값을 1 감소 (0 미만으로는 내려가지 않음)
    decrement() {
      this.number > 0 ? this.number-- : this.number;
    },

    // 모든 컴포넌트의 데이터를 초기 상태로 재설정
    resetForm() {
      this.number = 0;
      this.name = '철수';
      this.gender = '남자';
      this.age = 20;
      this.message = ''; // input 요소의 입력 내용 초기화
      alert('모든 값이 초기화되었습니다!');
    }
  }
}
</script>

<template>
  <div>
    <!-- 카운터 섹션: 숫자 증가/감소 기능을 제공 -->
    <section class="counter-section">
      <h1>현재 숫자: {{ number }}</h1>
      <button @click="increment" v-once>증가</button>
      <button @click="decrement" v-once>감소</button>
    </section>

    <!-- 입력 섹션: 사용자 메시지 입력 및 유효성 검사를 처리 -->
    <section class="input-section">
      <!-- @input으로 실시간 입력 처리, :value로 message와 바인딩 -->
      <input
        type="text"
        :value="message"
        @input="onChangeHandler($event)"
        placeholder="메시지를 입력하세요"
      />
      <!-- 입력 유효성 검사 결과에 따라 경고 메시지를 표시 -->
      <p v-if="!isMessageValid" class="warning-message">메시지를 입력해주세요!</p>
      <!-- 현재 메시지를 표시 -->
      <p class="current-message">입력된 메시지: {{ message || '아직 입력된 내용이 없습니다.' }}</p>
      <button @click="clickHandler($event, '환영합니다')" v-once>클릭 테스트</button>
    </section>

    <!-- 프로필 섹션: 사용자 정보를 표시하고 수정 -->
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

    <!-- 전체 초기화 버튼: 모든 데이터를 초기 상태로 변경 -->
    <button @click="resetForm" class="reset-button" v-once>모든 값 초기화</button>
  </div>
</template>

<style>
</style>