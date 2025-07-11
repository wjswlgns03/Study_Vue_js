<template>
  <div class="not-found">
    <h1>Error 404</h1>
    <p>{{ errorMessage }}</p>
    <router-link to="/">Go to Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    errorMessage: {
      type: String,
      default: 'Page not found'
    }
  }
}
</script>

<style scoped>
.not-found {
  padding: 20px;
  text-align: center;
}
</style>
