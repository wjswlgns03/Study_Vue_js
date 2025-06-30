<script>
export default {
  data() {
    return {
      number: 0,
      name: '철수',
      gender: '남자',
      age: 20,
      inputMessage: '',
      isFormValid: true
    };
  },
  methods: {
    // 사용자 정의 메시지와 이벤트 로깅을 포함한 버튼 클릭 처리
    clickHandler(event, message) {
      alert(`${message}! 버튼이 클릭되었습니다.`);
      console.log('버튼 이벤트:', event);
    },
    // 입력 필드에서 Enter 키 눌렀을 때 유효성 검사 처리
    onKeyupHandler() {
      if (this.inputMessage.trim() === '') {
        this.isFormValid = false;
        alert('메시지를 입력해주세요!');
        return;
      }
      this.isFormValid = true;
      console.log('메시지와 함께 Enter 키 눌림:', this.inputMessage);
      alert(`입력된 메시지: ${this.inputMessage}`);
    },
    // 카운터 증가
    increment() {
      this.number++;
    },
    // 범위 확인 후 카운터 감소
    decrement() {
      this.number > 0 ? this.number-- : this.number;
    },
    // 모든 데이터를 초기 상태로 재설정
    resetForm() {
      this.number = 0;
      this.name = '철수';
      this.gender = '남자';
      this.age = 20;
      this.inputMessage = '';
      this.isFormValid = true;
      alert('폼이 초기화되었습니다!');
    }
  },
  computed: {
    // 표시를 위한 나이 상태 유효성 검사
    ageStatus() {
      return this.age >= 18 ? '성인' : '미성년자';
    }
  }
}
</script>

<template>
  <div>
    <!-- 카운터 섹션 -->
    <div>
      <h1>{{ number }}</h1>
      <button @click="increment">증가</button>
      <button @click="decrement">감소</button>
    </div>

    <!-- 입력 섹션 -->
    <div>
      <input 
        type="text" 
        v-model="inputMessage"
        @keyup.enter="onKeyupHandler"
        placeholder="메시지를 입력 후 Enter"
      />
      <p v-if="!isFormValid">메시지를 입력해주세요!</p>
      <button @click="clickHandler($event, 'Hello')">클릭 테스트</button>
    </div>

    <!-- 프로필 섹션 -->
    <div v-memo="[name, gender]">
      <p>이름: {{ name }}</p>
      <p>성별: {{ gender }}</p>
      <p>나이: {{ age }} ({{ ageStatus }})</p>

      <!-- 데이터 변경 테스트 -->
      <button @click="name = '영희'">이름 변경</button>
      <button @click="gender = '여자'">성별 변경</button>
      <button @click="age = 30">나이 변경</button>
    </div>

    <!-- 초기화 버튼 -->
    <button @click="resetForm">모든 값 초기화</button>
  </div>
</template>

<style>
</style>