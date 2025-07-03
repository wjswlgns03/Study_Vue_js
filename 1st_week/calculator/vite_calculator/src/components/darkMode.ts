import { state } from './state';

export const ch_BG_Color = () => {
    state.isDarkMode = !state.isDarkMode;
    
    console.log(`다크 모드 ${state.isDarkMode ? '활성화' : '비활성화'}`);

    document.body.style.backgroundColor = state.isDarkMode ? '#ffffff' : '#242424';
};