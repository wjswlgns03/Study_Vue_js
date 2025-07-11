
<template>
  <slot :message="message" :count="count"></slot>
</template>

<script>
export default {
  data() {
    return {
      message: '슬롯 메시지 내용입니다.',
      count: 42
    };
  }
};
</script>
