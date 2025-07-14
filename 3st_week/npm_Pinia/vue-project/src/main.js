import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia() // pinia 인스턴스 생성

app.use(router)   // 라우터 인스턴스 등록
app.use(pinia)    // pinia 인스턴스 등록
app.mount('#app')
