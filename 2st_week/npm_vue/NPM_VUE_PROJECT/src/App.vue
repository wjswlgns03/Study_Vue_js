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
// 코드 길이가 길어져 컴포넌트 분리
import FirstChild from './components/FirstChild.vue';
import ParentChild from './components/ParentChild.vue';
import CustomButton from './components/CustomButton.vue';
import DynamicLayout from './components/DynamicLayout.vue';
import BasicScope from './components/BasicScope.vue';

export default {
  // 현재 컴포넌트에서 사용할 하위 컴포넌트들을 등록
  components: {
    FirstChild,
    ParentChild,
    CustomButton,
    DynamicLayout,
    BasicScope
  },
  // provide 옵션을 사용하여 하위 컴포넌트(자식, 손자 등)에 데이터를 제공
  provide() {
    return {
      message: this.message, // data에 정의된 message를 제공
    };
  },
  // 컴포넌트의 반응형 데이터를 정의
  data() {
    return {
      message: 'Vue JS에서 인사드립니다!', // 제공될 메시지
      dynamicName: 'header', // 동적 슬롯의 이름으로 사용될 변수
      parentNum: 42 // 부모 컴포넌트의 숫자 데이터
    };
  },
  // 계산된 속성(computed properties)을 정의 데이터가 변경될 때만 재계산
  computed: {
    // parentNum이 짝수인지 홀수인지 판단하여 문자열을 반환
    numOddEven() {
      return this.parentNum % 2 === 0 ? '짝수' : '홀수';
    }
  },
  // 컴포넌트의 메서드를 정의
  methods: {
    // parentNum 값을 반환하는 메서드
    getParentNum() {
      return this.parentNum;
    }
  },
  // 컴포넌트가 마운트(DOM에 삽입)된 후에 실행되는 라이프사이클 훅
  mounted() {
    // Refs 예시: 'childRef'라는 ref 속성을 가진 FirstChild 컴포넌트에 접근
    if (this.$refs.childRef) {
      console.log('--- Refs 예시 (콘솔 출력) ---');
      // 자식 컴포넌트의 childNum 데이터에 접근하여 콘솔에 출력
      console.log('자식 숫자 (childNum):', this.$refs.childRef.childNum);
      // 자식 컴포넌트의 childNumOddAdd 계산된 속성에 접근하여 콘솔에 출력
      console.log('자식 숫자 홀수 더하기 (childNumOddAdd):', this.$refs.childRef.childNumOddAdd);
      // 자식 컴포넌트의 getChildNum 메서드를 호출하여 반환 값을 콘솔에 출력
      console.log('자식 숫자 가져오기 (getChildNum()):', this.$refs.childRef.getChildNum());
      console.log('----------------------------');
    }
  }
};
</script>


<style scoped>

.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 30px;
}

h2 {
  color: #0056b3;
  margin-top: 40px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #ddd;
}

.example-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.example-section p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #555;
}

.example-section strong {
  color: #d9534f; 
}

.component-interaction-area {
  border: 1px dashed #a0a0a0;
  padding: 15px;
  margin-top: 20px;
  background-color: #f0f8ff; 
  border-radius: 4px;
}

.explanation-note {
  font-size: 0.9em;
  color: #6a6a6a;
  margin-top: 15px;
  border-top: 1px dotted #ccc;
  padding-top: 10px;
}
</style>