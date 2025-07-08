<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    
    // 'add-todo' 이벤트를 부모 컴포넌트에게 발생시킬 수 있음
    emits: ['add-todo'],

    // 두 번째 인자로 emit 함수를 받아 이벤트를 발생시킬 수 있음
    setup(_, { emit }) {
        
        const inputMsg = ref<string>('');       // 할 일 입력을 위한 반응형 상태
        const error = ref<string>('');          // 에러 반응형 상태
        const charLimitError = ref<string>(''); // 글자수 제한
        const maxLength = 40;                   // 최대 글자 수를 40자로 설정  

        // 할 일을 추가하는 함수
        const addTodo = () => {
            // 새로운 할 일을 추가하기 전에 기존의 모든 에러 메시지를 초기화
            error.value = '';
            charLimitError.value = '';

            // input 값이 비어있거나 공백만 있는 경우 처리
            if (!inputMsg.value.trim()) {
                error.value = '할 일을 입력해주세요.';
                
                // 3초 후에 에러 메시지를 자동으로 지움
                setTimeout(() => {
                    error.value = '';
                }, 3000);
                return; 
            }

            // input 값이 최대 글자 수를 초과하는 경우 처리
            if (inputMsg.value.trim().length > maxLength) {
                charLimitError.value = `할 일은 최대 ${maxLength}자까지 입력할 수 있습니다.`;
                return; 
            }

            // 모든 유효성 검사를 통과하면 'add-todo' 이벤트를 발생시키고,
            // inputMsg의 현재 값을 페이로드로 전달
            emit('add-todo', inputMsg.value);

            // 할 일 추가 후 input 필드를 초기화
            inputMsg.value = '';

            // 혹시 남아있을 수 있는 에러 메시지들을 다시 초기화
            error.value = '';
            charLimitError.value = '';
        };

        return { inputMsg, error, charLimitError, addTodo, maxLength };
    },
});
</script>

<template>
    <div class="todo__input">
        
        <!-- 할 일 입력 필드 -->
        <input
            v-model="inputMsg"                                 
            type="text"
            class="todo__input-text"
            :class="{ 'todo__input-text--error': error || charLimitError }" 
            placeholder="할 일을 입력하세요."                   
            @keyup.enter="addTodo"                              
            :maxlength="maxLength"                              
        />
        
        <!-- 등록 버튼 -->
        <button
            class="todo__input-btn"
            :disabled="!inputMsg.trim() || inputMsg.length > maxLength" 
            @click="addTodo"                                    
        >
            등록
        </button>

        <!-- 일반 에러 메시지 표시 (error 값이 있을 때만 보임) -->
        <p v-if="error" class="todo__error">{{ error }}</p>

        <!-- 글자 수 제한 에러 메시지 표시 (charLimitError 값이 있을 때만 보임) -->
        <p v-if="charLimitError" class="todo__error">{{ charLimitError }}</p>

        <!-- 현재 글자 수와 최대 글자 수를 표시하는 카운터 -->
        <div class="todo__char-count">
            {{ inputMsg.trim().length }}/{{ maxLength }}
        </div>
    </div>
</template>

<style scoped>
</style>