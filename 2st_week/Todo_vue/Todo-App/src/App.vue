<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import './assets/main.css';
import TodoHeader from './components/TodoHeader.vue';
import TodoList from './components/TodoList.vue';
import TodoInput from './components/TodoInput.vue';

// Todo 항목의 타입 정의
interface TodoItem {
  id: number;
  msg: string;
  completed: boolean;
  isEditing?: boolean;
}

export default defineComponent({
  name: 'App',
  components: {
    TodoHeader,
    TodoList,
    TodoInput,
  },
  setup() {
    // 로컬 스토리지에서 초기 데이터 로드
    const todo = ref<TodoItem[]>(JSON.parse(localStorage.getItem('todos') || '[]'));
    const current = ref<'all' | 'completed'>('all');

    // todo 변경 시 로컬 스토리지에 저장
    watch(todo, (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }, { deep: true });

    // 계산된 속성
    const computedTodo = computed(() => {
      if (current.value === 'all') return todo.value;
      return todo.value.filter((item) => item.completed);
    });

    // 메서드
    const addTodo = (inputMsg: string) => {
      const item: TodoItem = {
        id: Date.now(),
        msg: inputMsg,
        completed: false,
        isEditing: false,
      };
      todo.value.push(item);
    };

    const updateTab = (tab: 'all' | 'completed') => {
      current.value = tab;
    };

    const deleteTodo = (id: number) => {
      todo.value = todo.value.filter((item) => item.id !== id);
    };

    const updateTodo = (id: number) => {
      todo.value = todo.value.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
    };

    const startEdit = (id: number) => {
      todo.value = todo.value.map((item) =>
        item.id === id ? { ...item, isEditing: true } : { ...item, isEditing: false }
      );
    };

    const editTodo = (id: number, newMsg: string) => {
      todo.value = todo.value.map((item) =>
        item.id === id ? { ...item, msg: newMsg.trim() || item.msg, isEditing: false } : item
      );
    };

    const completeAll = () => {
      todo.value = todo.value.map((item) => ({ ...item, completed: true }));
    };

    const clearCompleted = () => {
      todo.value = todo.value.filter((item) => !item.completed);
    };

    return {
      current,
      computedTodo,
      addTodo,
      updateTab,
      deleteTodo,
      updateTodo,
      startEdit,
      editTodo,
      completeAll,
      clearCompleted,
    };
  },
});
</script>

<template>
  <div class="todo">
    <TodoHeader
      :current="current"
      @update-tab="updateTab"
      @complete-all="completeAll"
      @clear-completed="clearCompleted"
    />
    <TodoList
      :computed-todo="computedTodo"
      @delete-todo="deleteTodo"
      @update-todo="updateTodo"
      @start-edit="startEdit"
      @edit-todo="editTodo"
    />
    <TodoInput @add-todo="addTodo" />
  </div>
</template>