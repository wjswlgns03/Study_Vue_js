
<template>
  <button class="btn">
    <slot>제출</slot>
  </button>
</template>

<script>
export default {};
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
