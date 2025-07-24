import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMonth = now.getMonth(); // 0: 1월, 11: 12월

    // 계절 판별
    let sunriseHour, sunsetHour;

    if (currentMonth >= 5 && currentMonth <= 7) {
        // 여름 (6월~8월): 일출 5시, 일몰 20시
        sunriseHour = 5;
        sunsetHour = 20;
    } else if (currentMonth >= 11 || currentMonth <= 1) {
        // 겨울 (12월~2월): 일출 7시, 일몰 17시
        sunriseHour = 7;
        sunsetHour = 17;
    } else {
        // 봄/가을 (3~5월, 9~11월): 일출 6시, 일몰 18시 30분
        sunriseHour = 6;
        sunsetHour = 18.5; // 18시 30분
    }

    // 시간대에 따른 배경 및 텍스트 색상 설정
    if (currentHour >= sunriseHour && currentHour < 12) {
        // 일출 ~ 정오: 아침
        body.className = 'morning-bg';
    } else if (currentHour >= 12 && currentHour < sunsetHour) {
        // 정오 ~ 일몰: 점심
        body.className = 'afternoon-bg';
    } else {
        // 일몰 ~ 일출: 저녁/밤
        body.className = 'evening-bg';
    }
});