<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'; 
import './assets/main.css'; 
import TodoHeader from './components/TodoHeader.vue'; // Todo 목록 상단 헤더 컴포넌트
import TodoList from './components/TodoList.vue';     // Todo 목록을 보여주는 컴포넌트
import TodoInput from './components/TodoInput.vue';   // 새 Todo를 입력하는 컴포넌트

interface TodoItem {
  id: number;          // Todo의 고유 식별자
  msg: string;         // Todo 내용
  completed: boolean;  // Todo 완료 여부 (true: 완료, false: 미완료)
  isEditing?: boolean; // Todo가 현재 편집 중인지 여부 (선택 사항)
}

export default defineComponent({
  // 자식 컴포넌트
  components: {
    TodoHeader,
    TodoList,
    TodoInput,
  },

  setup() {
    /**로컬 스토리지에서 Todo 데이터를 불러옴 (만약 데이터가 없으면 빈 배열로 초기화) */
    const todo = ref<TodoItem[]>(JSON.parse(localStorage.getItem('todos') || '[]'));
    
    /**현재 활성화된 탭 상태. 'all' (전체), 'completed' (완료된 항목) */
    const current = ref<'all' | 'completed'>('all');

    /**배열의 변화를 감지하고, 변화가 있을 때마다 로컬 스토리지에 저장 */
    watch(todo, (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }, { deep: true });   // 배열 내부의 객체 변화까지 깊게 감지

    /**탭 상태에 따라 필터링된 Todo 목록을 반환하는 계산된 속성 */
    const computedTodo = computed(() => {
      // 'all'이면 전체 Todo 목록을, 아니면 완료된 Todo만 반환
      if (current.value === 'all') return todo.value;
      return todo.value.filter((item) => item.completed);
    });

    /**새 Todo 항목을 추가 */
    const addTodo = (inputMsg: string) => {
      
      // 새 객체 생성
      const item: TodoItem = {
        id: Date.now(), // 현재 시간을 ID로 사용하여 고유성을 확보
        msg: inputMsg,
        completed: false, // 기본적으로 미완료 상태
        isEditing: false, // 기본적으로 편집 모드 아님
      };
      todo.value.push(item); // todo 배열에 새 항목 추가
    };

    /**탭을 변경 (전체 보기 / 완료된 항목 보기) */
    const updateTab = (tab: 'all' | 'completed') => {
      current.value = tab; // 'current' 상태를 전달받은 탭으로 업데이트
    };

    /**특정 ID의 Todo를 삭제 */
    const deleteTodo = (id: number) => {
      // 해당 ID를 가진 항목을 제외하고 새 배열을 만들어 'todo'를 업데이트
      todo.value = todo.value.filter((item) => item.id !== id);
    };

    /**특정 ID의 Todo 완료 상태를 토글 */
    const updateTodo = (id: number) => {
      // 해당 ID의 Todo를 찾아 'completed' 상태를 반전시킴
      todo.value = todo.value.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
    };

    /**특정 ID의 Todo를 편집 모드로 전환 */
    const startEdit = (id: number) => {
      // 해당 ID의 Todo만 'isEditing'을 true로, 나머지는 false로 설정
      todo.value = todo.value.map((item) =>
        item.id === id ? { ...item, isEditing: true } : { ...item, isEditing: false }
      );
    };


    /**특정 ID의 Todo 내용을 수정하고 편집 모드를 종료 */
    const editTodo = (id: number, newMsg: string) => {
      // 해당 ID의 Todo를 찾아 'msg'를 새 내용으로 업데이트하고 'isEditing'을 false로 설정
      // 새 내용이 비어있으면 기존 내용을 유지
      todo.value = todo.value.map((item) =>
        item.id === id ? { ...item, msg: newMsg.trim() || item.msg, isEditing: false } : item
      );
    };

    /**모든 Todo를 완료 상태로 만드는 함수 */
    const completeAll = () => {
      // 모든 항목의 'completed'를 true로 설정
      todo.value = todo.value.map((item) => ({ ...item, completed: true }));
    };

    /**완료된 모든 Todo를 삭제 */
    const clearCompleted = () => {
      // 'completed'가 false인 항목만 남기고 필터링
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
    
    <!-- 탭 전환 및 전체 완료/완료된 항목 삭제 기능 제공 -->
    <TodoHeader
      :current="current"                  
      @update-tab="updateTab"             
      @complete-all="completeAll"         
      @clear-completed="clearCompleted"   
    />
    
    <!-- 필터링된 Todo 목록을 표시하고 각 항목의 액션 처리 -->
    <TodoList
      :computed-todo="computedTodo"       
      @delete-todo="deleteTodo"           
      @update-todo="updateTodo"           
      @start-edit="startEdit"             
      @edit-todo="editTodo"               
    />
    
    <!-- 새로운 Todo를 입력하고 추가하는 기능 제공 -->
    <TodoInput @add-todo="addTodo" />     
  </div>
</template>