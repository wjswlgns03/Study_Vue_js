<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #007bff;
  text-decoration: none;
}

.cart-link:hover {
  text-decoration: underline;
}

.product-list {
  list-style: none;
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.2s;
}

.product-item.in-cart {
  background-color: #f1f9ff;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
}

.product-details {
  flex-grow: 1;
}

.product-name {
  font-weight: bold;
}

.product-price {
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

.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
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
  <div class="home-container">
    <p><b style="font-size: 32px;">상품목록</b> (5만원 이상 구매 시 10% 할인)</p>
    <RouterLink to="/cart" class="cart-link" aria-label="장바구니 페이지로 이동">장바구니</RouterLink>
    <ul class="product-list">
      <li
        v-for="it in item"
        :key="it.id"
        class="product-item"
        :class="{ 'in-cart': isInCart(it.id) }"
      >
        <img v-if="it.image" :src="it.image" :alt="it.name" class="product-image" />
        <div class="product-details">
          <span class="product-name">{{ it.name }}</span>
          <span class="product-price">{{ it.price.toLocaleString() }}원</span>
          <div v-if="isInCart(it.id)" class="quantity-controls">
            <button
              @click="updateQuantity(it.id, getItemQuantity(it.id) - 1)"
              :disabled="getItemQuantity(it.id) <= 1"
              aria-label="수량 감소"
            >
              -
            </button>
            <span>{{ getItemQuantity(it.id) }}</span>
            <button
              @click="updateQuantity(it.id, getItemQuantity(it.id) + 1)"
              aria-label="수량 증가"
            >
              +
            </button>
          </div>
        </div>
        <button
          v-if="!isInCart(it.id)"
          @click="inCart(it.id)"
          class="add-button"
          aria-label="장바구니에 추가"
        >
          담기
        </button>
        <button
          v-else
          @click="outCart(it.id)"
          class="remove-button"
          aria-label="장바구니에서 제거"
        >
          삭제
        </button>
      </li>
    </ul>
    <!-- 토스트 알림 -->
    <div v-if="toastMessage" class="toast" :class="{ 'toast-error': toastType === 'error' }">
      {{ toastMessage }}
    </div>
  </div>
</template>




<script setup>
import { useCartStore } from '@/stores/cart.js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

// Pinia 스토어
const cartStore = useCartStore();
const { item } = storeToRefs(cartStore);

// 토스트 알림 상태
const toastMessage = ref('');
const toastType = ref('success');

// 장바구니에 항목이 있는지 확인
const isInCart = (id) => {
  return cartStore.cartItem.some((cart) => cart.id === id);
};

// 항목 수량 가져오기
const getItemQuantity = (id) => {
  const cartItem = cartStore.cartItem.find((cart) => cart.id === id);
  return cartItem ? cartItem.quantity : 1;
};

// 장바구니에 항목 추가
const inCart = (id) => {
  cartStore.updateQuantity(id, 1); // 수량 1로 추가
  showToast('상품이 장바구니에 추가되었습니다.');
  cartStore.saveCartToLocalStorage();
};

// 장바구니에서 항목 제거
const outCart = (id) => {
  cartStore.outCart(id);
  showToast('상품이 장바구니에서 삭제되었습니다.');
  cartStore.saveCartToLocalStorage();
};

// 항목 수량 업데이트
const updateQuantity = (id, quantity) => {
  cartStore.updateQuantity(id, quantity);
  showToast(`수량이 ${quantity}로 업데이트되었습니다.`);
  cartStore.saveCartToLocalStorage();
};

// 토스트 알림 표시
const showToast = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
};
</script>