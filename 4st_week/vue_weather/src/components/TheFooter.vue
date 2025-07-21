<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<template>
  <footer class="footer">
    <ul class="footer__list">
      <li class="footer__item">
        <RouterLink to="/" :class="{ disabled: isDisabled.home }" @click.prevent="handleClick('/', 'home', $event)">
          <span class="material-symbols-outlined footer_icons"> home </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/forecast" :class="{ disabled: isDisabled.forecast }" @click.prevent="handleClick('/forecast', 'forecast', $event)">
          <span class="material-symbols-outlined footer_icons"> stacked_line_chart </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/search" :class="{ disabled: isDisabled.search }" @click.prevent="handleClick('/search', 'search', $event)">
          <span class="material-symbols-outlined footer_icons"> search </span>
        </RouterLink>
      </li>
    </ul>
  </footer>
</template>




<script setup>
import { RouterLink, useRouter } from 'vue-router'; // Vue Router의 RouterLink와 useRouter 임포트
import { ref } from 'vue'; // 반응형 데이터를 위한 ref 임포트

// 내비게이션 버튼별 비활성화 상태 관리
const isDisabled = ref({
  home: false,    // 홈 버튼 상태
  forecast: false,  // 예측 버튼 상태
  search: false,  // 검색 버튼 상태
});

const router = useRouter(); // 라우터 인스턴스 초기화

// 버튼 클릭 이벤트 핸들러
const handleClick = async (to, key, event) => {
  // 버튼이 이미 비활성화 상태면 중복 클릭 방지
  if (isDisabled.value[key]) {
    event.preventDefault();
    return;
  }

  isDisabled.value[key] = true; // 클릭 시 버튼 비활성화
  try {
    await router.push(to); // 지정된 경로로 라우팅, 완료까지 대기
    isDisabled.value[key] = false; // 라우팅 완료 후 버튼 활성화
  } catch (error) {
    console.error('Navigation error:', error); // 라우팅 에러 발생 시 기록
    isDisabled.value[key] = false; // 에러 발생 시에도 버튼 상태 초기화
  }
};
</script>



