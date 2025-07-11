<template>
  <div class="user-view">
    <h1>User Profile</h1>
    <p>User ID: {{ id }}</p>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.user-view {
  padding: 20px;
  text-align: center;
}
</style>
