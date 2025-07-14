<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.main-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #007bff;
  text-decoration: none;
}

.main-link:hover {
  text-decoration: underline;
}

.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-weight: bold;
}

.item-price {
  color: #28a745;
  margin-left: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.quantity-controls button {
  padding: 5px 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  cursor: pointer;
}

.quantity-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.cart-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.pay-button,
.clear-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.pay-button {
  background-color: #28a745;
  color: white;
}

.clear-button {
  background-color: #6c757d;
  color: white;
}

.pay-button:disabled,
.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  padding: 20px;
}

.explore-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
}

.total-price {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.discount-info {
  color: #dc3545;
  font-size: 0.9em;
  margin-left: 10px;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.toast-error {
  background-color: #dc3545;
}
</style>

<template>
  <div class="cart-container">
    <h1>장바구니 목록</h1>
    <RouterLink to="/" class="main-link" aria-label="메인 페이지로 이동">메인</RouterLink>

    <div v-if="filteredCartItems.length > 0" class="cart-content">
      <!-- 총액 표시 -->
      <p class="total-price">
        총액: {{ totalPrice.toLocaleString() }}원
        <span v-if="discountApplied" class="discount-info">(10% 할인 적용)</span>
      </p>

      <ul class="cart-list">
        <li v-for="item in filteredCartItems" :key="item.id" class="cart-item">
          <img v-if="item.image" :src="item.image" :alt="item.name" class="item-image" />
          <div class="item-details">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">{{ (item.price * item.quantity).toLocaleString() }}원</span>
            <div class="quantity-controls">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                aria-label="수량 감소"
              >
                -
              </button>
              <span>{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                aria-label="수량 증가"
              >
                +
              </button>
            </div>
          </div>
          <button
            @click="outCart(item.id)"
            class="remove-button"
            aria-label="장바구니에서 제거"
          >
            삭제
          </button>
        </li>
      </ul>

      <div class="cart-actions">
        <button
          @click="payCart"
          :disabled="isPaying || filteredCartItems.length === 0"
          class="pay-button"
        >
          {{ isPaying ? '결제 중...' : '결제' }}
        </button>
        <button @click="allClear" class="clear-button" :disabled="filteredCartItems.length === 0">
          전체 비우기
        </button>
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>장바구니가 비어있습니다.</p>
      <RouterLink to="/" class="explore-button">상품 둘러보기</RouterLink>
    </div>

    <!-- 토스트 알림 -->
    <div v-if="toastMessage" class="toast" :class="{ 'toast-error': toastType === 'error' }">
      {{ toastMessage }}
    </div>
  </div>
</template>





<script setup>
import { useCartStore } from '@/stores/cart.js'; 
import { computed, ref } from 'vue'; 

const cartStore = useCartStore();   // 장바구니 스토어 사용
const toastMessage = ref('');       // 토스트 메시지 상태
const toastType = ref('success');   // 토스트 메시지 타입 (성공/에러)

// 장바구니에 담긴 상품 목록과 수량을 결합하여 반환
const filteredCartItems = computed(() => {
  return cartStore.item
    .filter((v) => cartStore.cartItem.some((cart) => cart.id === v.id)) // 장바구니에 있는 상품만 필터링
    .map((item) => ({
      ...item,
      quantity: cartStore.cartItem.find((cart) => cart.id === item.id)?.quantity || 1, // 장바구니 수량 추가
    }));
});

// 할인 전 총액 계산
const rawTotal = computed(() => {
  return filteredCartItems.value.reduce(
    (prev, cur) => prev + cur.price * cur.quantity,
    0
  );
});

// 50,000원 이상 구매 시 할인 적용 여부
const discountApplied = computed(() => rawTotal.value >= 50000);

// 최종 결제 총액 (할인 적용)
const totalPrice = computed(() => {
  return discountApplied.value ? rawTotal.value * 0.9 : rawTotal.value;
});

const isPaying = ref(false); // 결제 진행 중 상태

// 장바구니 비우기
const allClear = () => {
  cartStore.cartItem.length = 0;        // 장바구니 배열 초기화
  showToast('장바구니가 비워졌습니다.');  // 토스트 메시지 표시
  cartStore.saveCartToLocalStorage();   // 로컬 스토리지에 저장
};

// 장바구니에서 특정 상품 삭제
const outCart = (id) => {
  cartStore.outCart(id);  // 스토어에서 상품 삭제
  showToast('상품이 장바구니에서 삭제되었습니다.'); // 토스트 메시지 표시
  cartStore.saveCartToLocalStorage(); // 로컬 스토리지에 저장
};

// 장바구니 상품 수량 업데이트
const updateQuantity = (id, quantity) => {
  if (quantity <= 0) {
    outCart(id); // 수량이 0 이하면 상품 삭제
  } else {
    cartStore.updateQuantity(id, quantity); // 스토어에서 수량 업데이트
    showToast(`수량이 ${quantity}로 업데이트되었습니다.`); // 토스트 메시지 표시
    cartStore.saveCartToLocalStorage(); // 로컬 스토리지에 저장
  }
};

// 장바구니 상품 결제 처리
const payCart = async () => {
  if (filteredCartItems.value.length === 0) {
    showToast('장바구니가 비어있습니다.', 'error'); // 장바구니 비어있으면 에러 토스트
    return;
  }

  isPaying.value = true; // 결제 진행 중 상태로 변경
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 결제 시뮬레이션
    const price = totalPrice.value;
    showToast(`총 ${price.toLocaleString()}원 결제가 완료되었습니다.`); // 결제 완료 토스트
    cartStore.cartItem.length = 0; // 장바구니 비우기
    cartStore.saveCartToLocalStorage(); // 로컬 스토리지에 저장
  } catch (error) {
    showToast(`결제 중 오류가 발생했습니다: ${error.message}`, 'error'); // 에러 발생 시 토스트
  } finally {
    isPaying.value = false; // 결제 상태 초기화
  }
};

// 토스트 메시지 표시 함수
const showToast = (message, type = 'success') => {
  toastMessage.value = message; // 메시지 설정
  toastType.value = type; // 타입 설정
  setTimeout(() => {
    toastMessage.value = ''; // 3초 후 메시지 초기화 (숨김)
  }, 3000);
};
</script>