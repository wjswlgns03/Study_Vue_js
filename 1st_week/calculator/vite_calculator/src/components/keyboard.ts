import { onMounted, onUnmounted } from 'vue';
import { state } from './state';
import { userInput, operation, clear } from './calculator';
import { ch_BG_Color } from './darkMode';

export const setupKeyboard = () => {
    const KeyDownEvt = (event: KeyboardEvent) => {
        const key = event.key;

        // 숫자 키(0-9)와 소수점(.) 입력 처리
        if (/^[0-9]$/.test(key)) {
            userInput(key);
        } else if (key === '.') {
            userInput('.');
        } 
        
        // 연산자 키(+,-,*,/) 입력 처리
        else if (['+', '-', '*', '/'].includes(key)) {
            operation(key);
        } 
        
        // 'Enter' 키 또는 '=' 키는 현재 입력값을 계산하고 결과를 표시
        else if (key === 'Enter' || key === '=') {
            operation('=');
        }
        // 'Escape' 키는 기록(history)이 표시된 경우 기록을 닫고, 그렇지 않으면 계산기를 초기화
        // 'c' 또는 'C' 키는 계산기를 초기화
        else if (key === 'Escape' || key === 'c' || key === 'C') {
            if (key === 'Escape' && state.showHistory) {
                state.showHistory = false;
            } else {
                clear();
            }
        }
        // 'h' 또는 'H' 키는 계산 기록 표시 여부를 설정
        else if (key === 'h' || key === 'H') {
            state.showHistory = true;
        }
        // 'd' 또는 'D' 키는 배경색(다크 모드, 라이트 모드)을 전환
        else if (key === 'd' || key === 'D') {
            ch_BG_Color();
        }
    };

    // 컴포넌트가 마운트될 때 키보드 이벤트 리스너를 추가
    onMounted(() => {
        window.addEventListener('keydown', KeyDownEvt);
    });

    // 컴포넌트가 언마운트될 때 키보드 이벤트 리스너를 제거하여 메모리 누수를 방지
    onUnmounted(() => {
        window.removeEventListener('keydown', KeyDownEvt);
    });
};