# 쇼핑 카트 애플리케이션

Vue.js와 Pinia를 사용하여 상태 관리를 구현한 간단한 쇼핑 카트 애플리케이션 입니다.

사용자는 제품 목록을 탐색하고, 장바구니에 항목을 추가/제거하며, 수량을 업데이트하고, 50,000원 초과 구매 시 할인이 적용된 상태로 결제를 진행할 수 있습니다.

## 주요 기능

*   **제품 목록**: 이름, 가격, 이미지가 포함된 제품 목록을 표시
*   **장바구니 관리**: 사용자는 제품을 장바구니에 추가하고, 수량을 업데이트하며, 항목을 제거
*   **할인 로직**: 총 구매액이 50,000원을 초과할 경우 10% 할인을 적용
*   **영구 저장소**: 장바구니 데이터는 로컬 스토리지에 저장되고 로드
*   **토스트 알림**: 사용자 작업(예: 항목 추가/제거, 결제 완료)에 대한 피드백을 제공

## 코드 구조

애플리케이션은 다음의 주요 파일로 구성됩니다:

*   **HomeView.vue**: 제품 목록을 표시하고 사용자가 장바구니에 항목을 추가하거나 수량을 조정할 수 있도록 처리
*   **CartView.vue**: 장바구니 내용을 보여주고, 총 가격(할인 적용 여부 포함)을 계산하며, 결제를 처리
*   **stores/cart.js**: 제품 및 장바구니 데이터 관리를 위한 Pinia 스토어를 정의하며, 로컬 스토리지 영구 저장을 포함

## 주요 메서드

### HomeView.vue

*   `isInCart(id)`: 제품 ID로 해당 제품이 장바구니에 있는지 확인
*   `getItemQuantity(id)`: 장바구니에 있는 제품의 수량을 가져옴
*   `inCart(id)`: 제품을 초기 수량 1로 장바구니에 추가
*   `outCart(id)`: 장바구니에서 제품을 제거
*   `updateQuantity(id, quantity)`: 장바구니에 있는 제품의 수량을 업데이트
*   `showToast(message, type)`: 사용자 피드백을 위한 토스트 알림을 표시

### CartView.vue

*   `filteredCartItems` (computed): 장바구니 항목을 제품 세부 정보 및 수량과 결합
*   `rawTotal` (computed): 할인이 적용되기 전의 총 가격을 계산
*   `discountApplied` (computed): 10% 할인을 위해 총액이 50,000원을 초과하는지 여부를 결정
*   `totalPrice` (computed): 적용 가능한 경우 총액에 할인을 적용
*   `allClear()`: 장바구니를 비움
*   `outCart(id)`: 장바구니에서 특정 제품을 제거
*   `updateQuantity(id, quantity)`: 제품의 수량을 업데이트하거나, 수량이 0인 경우 제품을 제거
*   `payCart()`: 결제 과정을 시뮬레이션하고 성공 시 장바구니를 비움
*   `showToast(message, type)`: 토스트 알림을 표시

### cart.js (Pinia Store)

*   `item` (reactive): 제품 목록(예: 바나나, 오렌지)을 ID, 이름, 가격, 이미지와 함께 저장
*   `cartItem` (reactive): 장바구니 항목을 `{ id, quantity }` 쌍으로 저장
*   `updateQuantity(id, quantity)`: 장바구니에 제품을 추가하거나 수량을 업데이트하며, 수량이 0인 경우 제거
*   `outCart(id)`: 장바구니에서 제품을 제거
*   `saveCartToLocalStorage()`: 장바구니를 로컬 스토리지에 저장
*   `loadCartFromLocalStorage()`: 초기화 시 로컬 스토리지에서 장바구니를 로드

## Pinia 학습 회고
CartView.vue에서 filteredCartItems, rawTotal, discountApplied, totalPrice와 같은 computed 속성들은 Pinia 스토어의 상태를 기반으로 계산된 파생 상태입니다. Pinia 스토어 자체에서도 getters를 정의하여 이러한 파생 상태를 관리할 수 있으며, 이는 컴포넌트에서 복잡한 계산 로직을 분리하고 재사용성을 높이는 데 기여할 수 있다는 것을 알게되었습니다.