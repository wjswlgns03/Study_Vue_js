import { reactive, toRefs } from 'vue';

export const state = reactive({
    /** 계산 결과를 표시하는 문자열 */
    output: '',

    /** 이전 계산 결과 또는 입력된 값을 저장 (null 가능) */
    prev: null as string | null,

    /** 현재 입력 중인 숫자 또는 소수점 문자열 */
    cur: '',

    /** 현재 선택된 연산자 (+, -, *, /) 또는 null */
    operator: null as string | null,

    /** 현재 계산 수식 (예: '5 + 3') */
    expression: '',

    /** 계산 기록을 저장하는 배열 (최대 10개 항목) */
    history: [] as string[],

    /** 계산 기록 화면의 표시 여부를 결정하는 플래그 */
    showHistory: false,

    /** 다크모드 상태 */
    isDarkMode: false,
});

export const stateRefs = toRefs(state);