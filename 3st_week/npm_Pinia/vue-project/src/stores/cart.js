import { reactive } from 'vue';
import { defineStore } from 'pinia';

// 이미지 파일들을 명시적으로 import 합니다.
import bananaImage from '../assets/banana.png';
import orangeImage from '../assets/orange.png';
import mangoImage from '../assets/mango.png';
import appleImage from '../assets/apple.png';

export const useCartStore = defineStore('cart', () => {
  // 초기 상품 데이터 (reactive로 반응형 유지)
  const item = reactive([
    {
      id: 1,
      name: 'banana',
      price: 1000,
      image: bananaImage, // import 된 변수를 사용합니다.
    },
    {
      id: 2,
      name: 'orange',
      price: 3000,
      image: orangeImage,
    },
    {
      id: 3,
      name: 'mango',
      price: 5000,
      image: mangoImage,
    },
    {
      id: 4,
      name: 'apple',
      price: 4000,
      image: appleImage,
    },
  ]);

  // 장바구니 아이템: { id, quantity } 형식의 배열
  const cartItem = reactive([]);

  // 장바구니에 상품 추가 또는 수량 업데이트
  const updateQuantity = (id, quantity) => {
    const cartIndex = cartItem.findIndex((v) => v.id === id);
    if (cartIndex !== -1) {
      if (quantity <= 0) {
        // 수량이 0 이하이면 상품 제거
        cartItem.splice(cartIndex, 1);
      } else {
        // 기존 상품의 수량 업데이트
        cartItem[cartIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      // 새로운 상품 추가
      cartItem.push({ id, quantity });
    }
  };

  // 장바구니에서 상품 제거
  const outCart = (id) => {
    const indexToRemove = cartItem.findIndex((v) => v.id === id);
    if (indexToRemove !== -1) {
      cartItem.splice(indexToRemove, 1);
    }
  };

  // 장바구니를 로컬 스토리지에 저장
  const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartItem));
  };

  // 로컬 스토리지에서 장바구니 데이터 로드
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // 기존 cartItem을 비우고 로드된 데이터로 대체
      cartItem.length = 0;
      parsedCart.forEach((item) => {
        if (item.id && item.quantity > 0) {
          cartItem.push({ id: item.id, quantity: item.quantity });
        }
      });
    }
  };

  // 스토어 초기화 시 로컬 스토리지에서 데이터 로드
  loadCartFromLocalStorage();

  return { item, 
            cartItem, 
            updateQuantity, 
            outCart, 
            saveCartToLocalStorage, 
            loadCartFromLocalStorage };
});