<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

// 마지막 뷰포트 높이를 저장하여 중복 업데이트 방지
let lastVh = 0;

// 뷰포트 높이를 기반으로 --vh CSS 변수 설정
const updateVh = () => {
  const vh = window.innerHeight * 0.01; // 뷰포트 높이를 1% 단위로 계산
  if (vh !== lastVh) { // 이전 값과 다를 경우에만 업데이트
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    lastVh = vh; // 마지막 값 업데이트
  }
};

// 컴포넌트 마운트 전 초기 설정 및 이벤트 리스너 등록
onBeforeMount(() => {
  updateVh(); // 초기 뷰포트 높이 설정
  window.addEventListener('resize', updateVh); // 창 크기 변경 시 업데이트
  window.addEventListener('orientationchange', updateVh); // 모바일 기기 회전 시 업데이트
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVh);
  window.removeEventListener('orientationchange', updateVh);
});
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>
