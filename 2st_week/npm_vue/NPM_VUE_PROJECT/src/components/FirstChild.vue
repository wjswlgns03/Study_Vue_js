```vue
<template>
  <div>
    <h3>Provide/Inject: {{ message }}</h3>
  </div>
</template>

<script>
export default {
  inject: ['message'],
  data() {
    return {
      childNum: 10
    };
  },
  computed: {
    childNumOddAdd() {
      return this.childNum + 1;
    }
  },
  methods: {
    getChildNum() {
      return this.childNum;
    }
  }
};
</script>
```