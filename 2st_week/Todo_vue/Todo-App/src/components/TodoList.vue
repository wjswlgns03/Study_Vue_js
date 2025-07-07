<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

// Todo 항목의 타입 정의
interface TodoItem {
  id: number;
  msg: string;
  completed: boolean;
  isEditing?: boolean;
}

export default defineComponent({
  name: 'TodoList',
  props: {
    computedTodo: {
      type: Array as PropType<TodoItem[]>,
      default: () => [],
    },
  },
  emits: ['delete-todo', 'update-todo', 'start-edit', 'edit-todo'],
  setup(_, { emit }) {
    const deleteTodo = (id: number) => emit('delete-todo', id);
    const updateTodo = (id: number) => emit('update-todo', id);
    const startEdit = (id: number) => emit('start-edit', id);
    const editTodo = (id: number, newMsg: string) => emit('edit-todo', id, newMsg);

    return { deleteTodo, updateTodo, startEdit, editTodo };
  },
});
</script>

<template>
  <div class="todo__list">
    <div
      v-for="item in computedTodo"
      :key="item.id"
      class="todo__item"
      :class="{ 'todo__item--completed': item.completed }"
    >
      <input
        type="checkbox"
        :id="`chk${item.id.toString(36)}`"
        :checked="item.completed"
        @click="updateTodo(item.id)"
      />
      <label :for="`chk${item.id.toString(36)}`" class="todo__checkbox-label"></label>
      <span v-if="!item.isEditing" class="todo__item-text">{{ item.msg }}</span>
      <input
        v-else
        v-model="item.msg"
        type="text"
        class="todo__item-edit"
        @keyup.enter="editTodo(item.id, item.msg)"
        @blur="editTodo(item.id, item.msg)"
      />
      <span
        class="material-symbols-outlined todo__edit-icon"
        @click="startEdit(item.id)"
      >edit</span>
      <span
        class="material-symbols-outlined todo__delete-icon"
        @click="deleteTodo(item.id)"
      >delete</span>
    </div>
    <div v-if="computedTodo.length === 0" class="todo__item--no">
      <p>할 일이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>

</style>