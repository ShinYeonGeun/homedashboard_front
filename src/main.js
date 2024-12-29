//import '@/assets/css/main.css'
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { createPinia } from 'pinia'
import 'vuetify/styles'; // Vuetify 스타일시트
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons
import '@/assets/css/common.css'; // 
import '@/assets/css/layout.css'; // 
import router from './router'; // Vue Router를 import
import { useModal } from '@/utils/useModal';

// Vuetify 인스턴스 생성
// const vuetify = createVuetify();

const app = createApp(App);

// Vuetify를 Vue 애플리케이션에 통합
app.use(vuetify);

// Pinia를 애플리케이션에 등록
app.use(createPinia());

app.use(router); // Router 등록

useModal(app);

app.mount('#app');