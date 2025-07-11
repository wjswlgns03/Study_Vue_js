<template>
  <div class="container">
    <h1>Vue.js 컴포넌트 상호작용 및 슬롯 예시</h1>

    <!-- 1. Provide/Inject 섹션: 부모에서 자식으로 데이터 '주입' 흐름 시각화 -->
    <h2>1. Provide/Inject 예시</h2>
    <div class="example-section">
      <p>
        <strong>[App.vue -> FirstChild.vue]</strong> App.vue의 `message` 데이터(`{{ message }}`)가
        provide를 통해 FirstChild 컴포넌트로 주입
      </p>
      <div class="component-interaction-area">
        <!-- FirstChild 컴포넌트에 데이터를 provide/inject 방식으로 전달하는 예시 -->
        <FirstChild />
        <p class="explanation-note">
          ▲ FirstChild 컴포넌트 내부에서 App.vue로부터 주입된 메시지를 표시
        </p>
      </div>
    </div>

    <!-- 2. Refs 섹션: 부모가 자식 컴포넌트 인스턴스에 '직접 접근'하는 흐름 시각화 -->
    <h2>2. Refs 예시</h2>
    <div class="example-section">
      <p>
        <strong>[App.vue -> FirstChild.vue (Ref)]</strong> App.vue는 `ref="childRef"`를 사용하여
        FirstChild 컴포넌트 인스턴스에 직접 접근
      </p>
      <div class="component-interaction-area">
        <!-- FirstChild 컴포넌트를 ref 속성을 사용하여 참조하는 예시 -->
        <FirstChild ref="childRef" />
        <p class="explanation-note">
          ▲ 이 FirstChild 컴포넌트는 부모(App.vue)에 의해 참조되며,
          `mounted()` 훅에서 자식의 데이터와 메서드에 접근한 결과가 콘솔에 출력
        </p>
      </div>
    </div>

    <!-- 3. 부모 접근 섹션: 자식 컴포넌트가 부모 데이터에 '역으로 접근'하는 흐름 시각화 -->
    <h2>3. 부모 접근 예시</h2>
    <div class="example-section">
      <p>
        <strong>[ParentChild.vue -> App.vue ($parent)]</strong> ParentChild 컴포넌트가
        `$parent` 속성을 사용하여 부모(App.vue)의 데이터(`parentNum: {{ parentNum }}`)와
        계산된 속성(`numOddEven: {{ numOddEven }}`)에 접근
      </p>
      <div class="component-interaction-area">
        <!-- ParentChild 컴포넌트에서 $parent 속성을 사용하여 부모 컴포넌트의 데이터에 접근하는 예시 -->
        <ParentChild />
        <p class="explanation-note">
          ▲ ParentChild 컴포넌트 내부에서 부모의 데이터를 가져와 표시
        </p>
      </div>
    </div>

    <!-- 4. 기본 슬롯 섹션: 부모가 자식 컴포넌트 내부에 '콘텐츠를 삽입'하는 흐름 시각화 -->
    <h2>4. 기본 슬롯 예시</h2>
    <div class="example-section">
      <p>
        <strong>[App.vue -> CustomButton.vue (기본 슬롯)]</strong>
        CustomButton 컴포넌트 내부에 '사용자 정의 제출' 텍스트를 슬롯으로 삽입
      </p>
      <div class="component-interaction-area">
        <!-- CustomButton 컴포넌트에 '사용자 정의 제출' 텍스트를 슬롯으로 전달하는 예시 -->
        <CustomButton>사용자 정의 제출</CustomButton>
        <p class="explanation-note">
          ▲ CustomButton 컴포넌트는 `<slot></slot>` 위치에 이 텍스트를 렌더링
        </p>
      </div>
    </div>

    <!-- 5. 동적 슬롯 섹션: 부모가 '동적인 이름'으로 자식 컴포넌트 슬롯에 콘텐츠를 삽입하는 흐름 시각화 -->
    <h2>5. 동적 슬롯 예시</h2>
    <div class="example-section">
      <p>
        <strong>[App.vue -> DynamicLayout.vue (동적 슬롯)]</strong>
        `dynamicName` 변수(`{{ dynamicName }}`)의 값에 따라
        DynamicLayout 컴포넌트의 특정 슬롯에 콘텐츠를 삽입
      </p>
      <div class="component-interaction-area">
        <DynamicLayout>
          <!-- dynamicName 변수에 따라 동적으로 슬롯 이름을 결정하여 내용을 삽입하는 예시 -->
          <template #[dynamicName]>
            <h3>동적 슬롯 내용</h3>
          </template>
        </DynamicLayout>
        <p class="explanation-note">
          ▲ DynamicLayout 컴포넌트는 `dynamicName`에 해당하는 이름의 슬롯에
          `동적 슬롯 내용`을 렌더링
        </p>
      </div>
    </div>

    <!-- 6. 스코프드 슬롯 섹션: 자식이 부모에게 '데이터를 제공'하여 슬롯 콘텐츠를 렌더링하는 흐름 시각화 -->
    <h2>6. 스코프드 슬롯 예시</h2>
    <div class="example-section">
      <p>
        <strong>[BasicScope.vue -> App.vue (스코프드 슬롯)]</strong>
        BasicScope 컴포넌트가 슬롯을 통해 내부 데이터를 `slotProps` 객체로 App.vue에 제공하고,
        App.vue는 이 데이터를 사용하여 슬롯 콘텐츠를 렌더링
      </p>
      <div class="component-interaction-area">
        <!-- BasicScope 컴포넌트에서 전달하는 slotProps 데이터를 사용하여 내용을 렌더링하는 예시 -->
        <BasicScope v-slot="slotProps">
          <h3>
            BasicScope로부터 전달받은 데이터:
            <br>
            메시지: {{ slotProps.message }} / 카운트: {{ slotProps.count }}
          </h3>
        </BasicScope>
        <p class="explanation-note">
          ▲ BasicScope 컴포넌트가 제공한 `slotProps` 내의 `message`와 `count` 값을
          App.vue 템플릿에서 받아와 표시
        </p>
      </div>
    </div>
  </div>
</template>





<script>
import { ref, reactive, computed, watch, watchEffect, watchPostEffect } from 'vue';
import FirstChild from './components/FirstChild.vue';
import ParentChild from './components/ParentChild.vue';
import CustomButton from './components/CustomButton.vue';
import DynamicLayout from './components/DynamicLayout.vue';
import BasicScope from './components/BasicScope.vue';

export default {
  components: {
    FirstChild,
    ParentChild,
    CustomButton,
    DynamicLayout,
    BasicScope
  },
  // provide를 통해 하위 컴포넌트에 message 데이터 주입
  provide() {
    return {
      message: this.message,
    };
  },
  data() {
    return {
      message: '안녕하세요, Vue.js 컴포넌트 상호작용 예시입니다',
      dynamicName: 'header',
      parentNum: 42
    };
  },
  computed: {
    // parentNum이 짝수인지 홀수인지 계산
    numOddEven() {
      return this.parentNum % 2 === 0 ? '짝수' : '홀수';
    }
  },
  methods: {
    // parentNum 값을 반환하는 메서드
    getParentNum() {
      return this.parentNum;
    }
  },
  mounted() {
    // 컴포넌트 마운트 시 자식 컴포넌트의 refs를 통해 데이터 접근
    if (this.$refs.childRef) {
      console.log('--- Refs 예시 (콘솔 출력) ---');
      console.log('자식 숫자 (childNum):', this.$refs.childRef.childNum);
      console.log('자식 숫자 홀수 더하기 (childNumOddAdd):', this.$refs.childRef.childNumOddAdd);
      console.log('자식 숫자 가져오기 (getChildNum()):', this.$refs.childRef.getChildNum());
      console.log('----------------------------');
    }
  },
  setup() {
    // ref를 사용해 단일 반응형 값 정의
    const counter = ref(0);
    // counter 값을 증가시키는 함수
    const incrementCounter = () => {
      counter.value++;
    };

    // reactive를 사용해 반응형 객체 정의
    const userInfo = reactive({
      name: 'John Doe',
      age: 25
    });
    // userInfo.age를 증가시키는 함수
    const updateUser = () => {
      userInfo.age += 1;
    };

    // computed를 사용해 counter의 두 배 값을 계산
    const doubleCounter = computed(() => counter.value * 2);

    // watch를 사용해 counter 값 변화 감시
    watch(counter, (newValue, oldValue) => {
      console.log(`watch: counter가 ${oldValue}에서 ${newValue}로 변경됨`);
    });

    // watchEffect를 사용해 의존성(userInfo.age) 변경 시 즉시 실행
    watchEffect(() => {
      console.log(`watchEffect: userInfo.age가 ${userInfo.age}로 업데이트됨`);
    });

    // watchPostEffect를 사용해 DOM 업데이트 후 실행
    watchPostEffect(() => {
      console.log(`watchPostEffect: counter=${counter.value}, DOM 업데이트 완료`);
    });

    // 템플릿에서 사용할 반응형 데이터와 메서드 반환
    return {
      counter,
      incrementCounter,
      userInfo,
      updateUser,
      doubleCounter
    };
  }
};
</script>


<style scoped>
/* 전체 컨테이너 스타일 */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

/* 섹션 제목 스타일 */
h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

h2 {
  color: #34495e;
  margin-top: 40px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

/* 예시 섹션 스타일 */
.example-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* 컴포넌트 상호작용 영역 */
.component-interaction-area {
  padding: 15px;
  background-color: #ecf0f1;
  border-radius: 5px;
  margin-top: 15px;
}

/* 설명 노트 스타일 */
.explanation-note {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 10px;
}

/* 버튼 스타일 (CustomButton 컴포넌트용) */
button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

/* 동적/스코프드 슬롯 관련 콘텐츠 스타일 */
h3 {
  color: #e74c3c;
  margin: 10px 0;
}
</style>