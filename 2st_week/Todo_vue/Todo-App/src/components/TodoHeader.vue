<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'TodoHeader',
  props: {
    current: {
      type: String as PropType<'all' | 'completed'>,
      default: 'all',
    },
  },
  emits: ['update-tab', 'complete-all', 'clear-completed'],
  setup(_, { emit }) {
    const updateTab = (tab: 'all' | 'completed') => {
      emit('update-tab', tab);
    };

    const completeAll = () => {
      emit('complete-all');
    };

    const clearCompleted = () => {
      emit('clear-completed');
    };

    return { updateTab, completeAll, clearCompleted };
  },
});
</script>

<template>
  <div class="todo__title">
    <h1 class="todo__text">Todo List</h1>
    <ul class="todo__tab">
      <li
        :class="{ 'todo__tab--active': current === 'all' }"
        @click="updateTab('all')"
      >
        전체
      </li>
      <li
        :class="{ 'todo__tab--active': current === 'completed' }"
        @click="updateTab('completed')"
      >
        완료
      </li>
      <li class="todo__tab--action" @click="completeAll">
        모두 완료
      </li>
      <li class="todo__tab--action" @click="clearCompleted">
        완료된 항목 삭제
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>