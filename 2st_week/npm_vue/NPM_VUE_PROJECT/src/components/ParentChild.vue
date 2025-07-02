<template>
  <div>
    <h3>ParentChild 컴포넌트</h3>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log('부모 숫자:', this.$parent.parentNum);
    console.log('부모 숫자 홀/짝:', this.$parent.numOddEven);
    console.log('부모 숫자 가져오기:', this.$parent.getParentNum());
  }
};
</script>