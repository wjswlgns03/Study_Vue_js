<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

interface TodoItem {
  id: number;          // 고유 식별자
  msg: string;         // 내용
  completed: boolean;  // 완료 여부 (true: 완료, false: 미완료)
  isEditing?: boolean; // 현재 편집 중인지 여부 
}

export default defineComponent({

  // 부모 컴포넌트로부터 전달받는 데이터.
  props: {
    // 'computedTodo' 속성: 표시할 Todo 항목들의 배열.
    computedTodo: {
      type: Array as PropType<TodoItem[]>, // 타입은 TodoItem 객체 배열.
      default: () => [],                   // 기본값은 빈 배열.
    },
  },

  // 부모 컴포넌트로 발생시킬 수 있는 이벤트 목록
  emits: ['delete-todo',    // Todo 삭제 요청 시 발생
          'update-todo',    // Todo 완료 상태 변경 요청 시 발생
          'start-edit',     // Todo 편집 모드 진입 요청 시 발생
          'edit-todo'],     // Todo 내용 수정 완료 요청 시 발생

  // 컴포넌트의 로직을 구성하는 부분
  setup(_, { emit }) {
    /**특정 ID의 Todo 삭제 이벤트를 발생시킴 */
    const deleteTodo = (id: number) => emit('delete-todo', id);

    /**특정 ID의 Todo 완료 상태 변경 이벤트를 발생시킴 */
    const updateTodo = (id: number) => emit('update-todo', id);

    /**특정 ID의 Todo 편집 모드 진입 이벤트를 발생시킴 */
    const startEdit = (id: number) => emit('start-edit', id);

    /**특정 ID의 Todo 내용 수정 완료 이벤트를 발생시킴 */
    const editTodo = (id: number, newMsg: string) => emit('edit-todo', id, newMsg);

    return { deleteTodo, updateTodo, startEdit, editTodo };
  },
});
</script>

<template>
  <div class="todo__list">
    
    <!-- computedTodo 배열을 순회하며 각 Todo 항목을 렌더링 -->
    <div
      v-for="item in computedTodo"         
      :key="item.id"                       
      class="todo__item"                   
      :class="{ 'todo__item--completed': item.completed }" 
    >

      <!-- Todo 완료 상태를 변경하는 체크박스 -->
      <input
        type="checkbox"
        :id="`chk${item.id.toString(36)}`"   
        :checked="item.completed"            
        @click="updateTodo(item.id)"         
      />
      
      <!-- 체크박스 커스텀 스타일링을 위한 label -->
      <label :for="`chk${item.id.toString(36)}`" class="todo__checkbox-label"></label>

      <!-- Todo 내용 표시: item.isEditing이 false일 때만 보임 -->
      <span v-if="!item.isEditing" class="todo__item-text">{{ item.msg }}</span>
      
      <!-- Todo 내용 편집 입력 필드: item.isEditing이 true일 때만 보임 -->
      <input
        v-else
        v-model="item.msg"                      
        type="text"
        class="todo__item-edit"
        @keyup.enter="editTodo(item.id, item.msg)" 
        @blur="editTodo(item.id, item.msg)"        
      />
      
      <!-- 편집 아이콘: startEdit 함수 호출 (편집 모드 진입) -->
      <span
        class="material-symbols-outlined todo__edit-icon"
        @click="startEdit(item.id)"
      >edit</span>
      
      <!-- 삭제 아이콘: deleteTodo 함수 호출 -->
      <span
        class="material-symbols-outlined todo__delete-icon"
        @click="deleteTodo(item.id)"
      >delete</span>
    </div>

    <!-- 일정이 하나도 없을 때 표시되는 메시지 -->
    <div v-if="computedTodo.length === 0" class="todo__item--no">
      <p>할 일이 없습니다.</p>
    </div>

  </div>
</template>

<style scoped>
</style>