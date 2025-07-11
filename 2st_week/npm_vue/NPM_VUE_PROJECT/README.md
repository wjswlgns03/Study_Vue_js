# Vue.js 핵심 기능 실습

이 프로젝트는 Vue.js의 핵심 기능들을 실습하고 이해하는 데 중점을 둡니다. 특히 컴포넌트 간의 상호작용과 슬롯 기능, 그리고 Vue 3의 Composition API 활용법에 대해 다룹니다.

## 주요 기능

*   **Provide/Inject**: 부모 컴포넌트(`App.vue`)에서 자식 컴포넌트(`FirstChild.vue`)로 데이터를 주입하여 깊이 중첩된 컴포넌트 간의 데이터 전달을 간소화
*   **Refs**: 부모 컴포넌트가 자식 컴포넌트의 인스턴스에 직접 접근하여 데이터와 메서드를 호출
*   **$parent**: 자식 컴포넌트(`ParentChild.vue`)가 부모 컴포넌트(`App.vue`)의 데이터와 계산된 속성에 접근
*   **기본 슬롯**: 부모 컴포넌트가 자식 컴포넌트(`CustomButton.vue`) 내부의 `<slot>` 위치에 콘텐츠를 삽입하여 컴포넌트 재사용
*   **동적 슬롯**: 동적 슬롯 이름(`dynamicName`)을 통해 특정 슬롯에 콘텐츠를 조건부로 또는 동적으로 삽입하는 방법을 `DynamicLayout.vue`를 통해 실습
*   **스코프드 슬롯**: 자식 컴포넌트(`BasicScope.vue`)가 부모에게 데이터를 제공하여 슬롯 콘텐츠를 렌더링하는 슬롯 기법 이를 통해 부모 컴포넌트가 자식 컴포넌트의 데이터를 기반으로 슬롯 내용을 사용자 정의
*   **반응형 API**: Vue 3 Composition API의 핵심인 `ref`, `reactive`, `computed`, `watch`, `watchEffect`, `watchPostEffect`를 활용하여 반응형 데이터 관리 및 부수 효과를 처리

## 코드 구조

*   `App.vue`: Provide/Inject, Refs, $parent, 다양한 슬롯(기본, 동적, 스코프드) 등을 종합적으로 관리하고 사용하는 메인 컴포넌트
*   `components/FirstChild.vue`: Provide/Inject를 통해 부모로부터 전달받은 데이터를 받아 표시하는 컴포넌트
*   `components/ParentChild.vue`: `$parent`를 사용하여 부모 컴포넌트의 데이터에 접근하는 예시를 보여줍니다.
*   `components/CustomButton.vue`: 기본 슬롯을 사용하여 부모로부터 전달받은 콘텐츠를 렌더링하는 재사용 가능한 버튼 컴포넌트
*   `components/DynamicLayout.vue`: 동적 슬롯 이름을 통해 유동적인 콘텐츠 렌더링을 지원하는 레이아웃 컴포넌트
*   `components/BasicScope.vue`: 스코프드 슬롯을 통해 자식 컴포넌트 내부의 데이터를 부모에게 제공하여 슬롯 콘텐츠를 유연하게 구성하는 예시

## 학습 내용

*   **컴포넌트 간 데이터 전달**: Provide/Inject와 `$parent`(학습 목적)를 사용한 다양한 데이터 흐름 방식을 이해하고 적절한 상황에 적용
*   **Refs를 통한 직접 접근**: 부모가 자식 컴포넌트의 데이터와 메서드에 직접 접근하여 특정 기능을 제어
*   **슬롯 활용**: 기본 슬롯, 동적 슬롯, 스코프드 슬롯을 통해 컴포넌트의 재사용성을 극대화하고 유연한 콘텐츠 구성을 설계
*   **Vue 3 Composition API**:
    *   **`ref`**: 원시 값과 객체를 반응형으로 만들어 UI와 데이터를 동기화하는 방법을 학습
    *   **`reactive`**: 객체(Object, Array, Map, Set 등)를 반응형 프록시로 변환하여 복잡한 상태를 관리
    *   **`computed`**: 기존 반응형 데이터를 기반으로 새로운 파생 상태를 효율적으로 정의하고 캐싱하여 성능을 최적화
    *   **`watch`**: 특정 반응형 데이터의 변화를 감지하고, 해당 변화에 따라 특정 부수 효과(side effect)를 실행
    *   **`watchEffect`**: 반응형 의존성을 자동으로 추적하여 부수 효과를 실행하며, 간결하게 반응형 로직을 작성
    *   **`watchPostEffect`**: 컴포넌트 DOM 업데이트 이후에 부수 효과를 실행해야 할 때 `watchPostEffect` 사용
*   **컴포넌트 설계**: 부모-자식 컴포넌트 간의 상호작용과 데이터 흐름을 체계적으로 설계하고 관리
*   **콘솔 디버깅**: Refs와 watch를 활용하여 컴포넌트의 데이터 변화를 추적