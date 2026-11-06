import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { currentFrameworkKey } from './config/framework';
import './index.css';

createApp(App).provide(currentFrameworkKey, 'vue').use(router).mount('#root');
