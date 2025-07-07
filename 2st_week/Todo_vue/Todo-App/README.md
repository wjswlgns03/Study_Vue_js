# Vue Todo App

이 프로젝트는 Vue 3와 TypeScript를 활용하여 개발된 간단한 Todo 리스트 애플리케이션입니다. 사용자는 할 일을 추가, 삭제, 수정, 완료 상태 변경, 필터링(전체/완료) 및 대량 작업(모두 완료, 완료된 항목 삭제)을 수행할 수 있으며, 모든 데이터는 로컬 스토리지에 저장됩니다.

## 1. 주요 기능

*   **할 일 추가**: 사용자가 입력한 텍스트를 기반으로 새로운 Todo 항목을 추가 빈 입력 방지를 위한 유효성 검사 기능이 포함
*   **할 일 삭제**: 개별 Todo 항목을 삭제하거나 완료된 항목을 일괄 삭제
*   **할 일 수정**: Todo 항목의 텍스트를 수정할 수 있는 입력 필드를 제공
*   **완료 상태 변경**: 체크박스를 통해 Todo 항목의 완료 상태를 토글
*   **탭 필터링**: '전체'와 '완료' 탭을 통해 Todo 항목을 필터링
*   **대량 작업**: 모든 Todo 항목을 완료 상태로 변경하거나, 완료된 항목을 일괄 삭제
*   **데이터 지속성**: 로컬 스토리지를 사용하여 브라우저 새로고침 후에도 데이터를 유지

## 2. 코드 구조

*   `App.vue`: 전체 상태 관리와 핵심 로직을 처리
*   `TodoHeader.vue`: 탭(전체/완료) 및 대량 작업 버튼(모두 완료, 완료된 항목 삭제)을 포함
*   `TodoList.vue`: Todo 항목 목록을 표시하며, 각 항목의 삭제, 수정, 완료 상태 변경 기능을 제공
*   `TodoInput.vue`: 새로운 Todo 항목을 입력받고 유효성 검사를 수행
*   `main.css`: 애플리케이션의 전반적인 스타일을 정의

## 3. 주요 메서드

### 3.1. App.vue

*   `addTodo(inputMsg: string)`: 새로운 Todo 항목을 추가
*   `deleteTodo(id: number)`: 특정 ID의 Todo 항목을 삭제
*   `updateTodo(id: number)`: Todo 항목의 완료 상태를 토글
*   `editTodo(id: number, newMsg: string)`: Todo 항목의 텍스트를 수정
*   `startEdit(id: number)`: 수정 모드를 활성화
*   `updateTab(tab: 'all' | 'completed')`: 현재 탭 상태를 변경
*   `completeAll()`: 모든 Todo 항목을 완료 상태로 변경
*   `clearCompleted()`: 완료된 Todo 항목을 삭제

### 3.2. TodoList.vue

*   `deleteTodo(id: number)`: 삭제 이벤트를 상위 컴포넌트로 방출
*   `updateTodo(id: number)`: 완료 상태 변경 이벤트를 상위 컴포넌트로 방출
*   `startEdit(id: number)`: 수정 모드 시작 이벤트를 상위 컴포넌트로 방출
*   `editTodo(id: number, newMsg: string)`: 수정 완료 이벤트를 상위 컴포넌트로 방출

### 3.3. TodoInput.vue

*   `addTodo()`: 입력 유효성 검사 후 Todo 추가 이벤트를 상위 컴포넌트로 방출

### 3.4. TodoHeader.vue

*   `updateTab(tab: 'all' | 'completed')`: 탭 변경 이벤트를 상위 컴포넌트로 방출
*   `completeAll()`: 모든 항목 완료 이벤트를 상위 컴포넌트로 방출
*   `clearCompleted()`: 완료된 항목 삭제 이벤트를 상위 컴포넌트로 방출

## 4. 상태 관리 (Data State)

*   **`todo` (`App.vue`)**: `ref<TodoItem[]>`으로 정의된 반응형 배열로, 모든 Todo 항목을 저장 각 항목은 `{ id: number, msg: string, completed: boolean, isEditing?: boolean }` 형식
*   **`current` (`App.vue`)**: `ref<'all' | 'completed'>`로 정의된 반응형 문자열로, 현재 활성화된 탭(전체 또는 완료) 상태를 관리
*   **`computedTodo` (`App.vue`)**: `computed` 속성으로, `current` 값에 따라 필터링된 Todo 리스트를 반환
*   **`inputMsg` (`TodoInput.vue`)**: `ref<string>`으로 정의된 반응형 문자열로, 새로운 Todo 항목 입력 필드의 값을 관리
*   **`error` (`TodoInput.vue`)**: `ref<string>`으로 정의된 반응형 문자열로, 입력 유효성 검사 오류 메시지를 관리
*   **로컬 스토리지**: `watch` 기능을 사용하여 `todo` 배열의 변경 시 자동으로 `localStorage`에 데이터를 저장하고, 애플리케이션 초기화 시 저장된 데이터 호출

## 5. 학습 내용

*   **Vue 3 Composition API**: Options API 대신 Composition API를 사용하여 컴포넌트 로직을 모듈화하고 재사용성을 높이는 방법을 익혔습니다.
*   **TypeScript**: 인터페이스(`TodoItem`), `PropType`, 타입 제한(`'all' | 'completed'`)을 활용하여 코드의 타입 안전성을 확보하는 방법을 실습했습니다.
*   **로컬 스토리지**: `localStorage`를 사용한 데이터 지속성 구현 및 `watch`를 통한 반응형 데이터 동기화 방법을 학습했습니다.
*   **이벤트 시스템**: Vue의 이벤트 방출(`$emit`)과 Props를 활용한 컴포넌트 간 효율적인 통신 방법을 이해했습니다.
*   **TypeScript 오류 해결**: `TS2339`(속성 누락), `TS1484`(PropType 가져오기), `TS6133`(사용되지 않는 변수) 등 다양한 TypeScript 오류를 해결하며 문제 해결 능력을 향상시켰습니다.
