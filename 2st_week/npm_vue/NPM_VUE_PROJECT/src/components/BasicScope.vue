
<template>
  <slot :message="message" :count="count"></slot>
</template>

<script>
export default {
  data() {
    return {
      message: 'Scoped Slot Message',
      count: 42
    };
  }
};
</script>
