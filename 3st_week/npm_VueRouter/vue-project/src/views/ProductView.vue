<template>
  <div class="product-view">
    <h1>Product Page</h1>
    <p>Category: {{ category }}</p>
    <p>Item ID: {{ itemId }}</p>
    <p>Filter: {{ filter }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductView',
  props: {
    category: {
      type: String,
      required: true
    },
    itemId: {
      type: String,
      default: 'default'
    },
    filter: {
      type: String,
      default: 'all'
    }
  }
}
</script>

<style scoped>
.product-view {
  padding: 20px;
  text-align: center;
}
</style>
