<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  
  // 부모 컴포넌트로부터 데이터를 전달
  props: {
    current: {
      // 문자열이며, 'all' 또는 'completed' 값만 허용
      type: String as PropType<'all' | 'completed'>,
      // 'current' 속성이 전달되지 않을 경우 'all'로 초기화
      default: 'all',
    },
  },

  // 컴포넌트가 발생시킬 수 있는 이벤트(emits) 정의: 부모 컴포넌트로 메시지 전송
  emits: ['update-tab',       // 탭 변경 시 발생
          'complete-all',     // 모든 할 일 완료 요청 시 발생
          'clear-completed'], // 완료된 할 일 삭제 요청 시 발생

  // setup 함수: 컴포넌트의 로직을 구성하는 부분
  // emit 함수를 통해 이벤트를 발생
  setup(_, { emit }) {
    
    /** 탭 변경 이벤트를 발생 */
    const updateTab = (tab: 'all' | 'completed') => {
      emit('update-tab', tab); 
    };

    /** 모든 할 일을 완료 처리하는 이벤트를 발생 */
    const completeAll = () => {
      emit('complete-all'); 
    };

    /** 완료된 할 일 삭제 이벤트를 발생 */
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
      
      <!-- '전체' 탭: 'current' 값이 'all'일 때 활성화. 클릭 시 'all' 탭으로 전환 -->
      <li
        :class="{ 'todo__tab--active': current === 'all' }"
        @click="updateTab('all')"
      >
        전체
      </li>
      
      <!-- '완료' 탭: 'current' 값이 'completed'일 때 활성화. 클릭 시 'completed' 탭으로 전환 -->
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