<template>
  <div id="app">
    <Transition name="slide-up" mode="out-in" @after-enter="handleAfterEnter">
      <RouterView />
    </Transition>
  </div>
</template>

<script>
export default {
  methods: {
    handleAfterEnter() {
      // 트랜지션 완료 후 스크롤을 상단으로 이동
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
