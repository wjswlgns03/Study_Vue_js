<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'TodoInput',
    emits: ['add-todo'],
    setup(_, { emit }) {
        const inputMsg = ref<string>('');
        const error = ref<string>('');
        const charLimitError = ref<string>(''); // 글자 수 제한 에러 메시지 상태
        const maxLength = 40; // 최대 글자 수

        const addTodo = () => {
            // 기존 에러 메시지 모두 초기화
            error.value = '';
            charLimitError.value = '';

            if (!inputMsg.value.trim()) {
                error.value = '할 일을 입력해주세요.';
                // 3초 후에 에러 메시지 초기화
                setTimeout(() => {
                    error.value = '';
                }, 3000);
                return;
            }

            if (inputMsg.value.trim().length > maxLength) {
                charLimitError.value = `할 일은 최대 ${maxLength}자까지 입력할 수 있습니다.`;
                return;
            }

            emit('add-todo', inputMsg.value);
            inputMsg.value = '';
            // 성공적으로 추가되면 모든 에러 메시지 초기화
            error.value = '';
            charLimitError.value = '';
        };

        return { inputMsg, error, charLimitError, addTodo, maxLength };
    },
});
</script>

<template>
    <div class="todo__input">
        <input
        v-model="inputMsg"
        type="text"
        class="todo__input-text"
        :class="{ 'todo__input-text--error': error || charLimitError }"
        placeholder="할 일을 입력하세요."
        @keyup.enter="addTodo"
        :maxlength="maxLength" 
        />
        <button
        class="todo__input-btn"
        :disabled="!inputMsg.trim() || inputMsg.length > maxLength" 
        @click="addTodo"
        >
        등록
        </button>
        <p v-if="error" class="todo__error">{{ error }}</p>
        <p v-if="charLimitError" class="todo__error">{{ charLimitError }}</p> <!-- 글자 수 제한 에러 메시지 표시 -->
        <div class="todo__char-count">
            {{ inputMsg.trim().length }}/{{ maxLength }} <!-- 글자 수 카운터 -->
        </div>
    </div>
</template>

<style scoped>

</style>