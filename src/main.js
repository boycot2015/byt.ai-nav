import App from './App.vue';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { useBookmarkStore } from './store';
import { useAppStore } from './store';
import { useHotDataStore } from './store';

import contextmenu from 'vue3-contextmenu'
import 'vue3-contextmenu/dist/vue3-contextmenu.css'

import 'element-plus/dist/index.css';
import './assets/styles/index.css';


const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(ElementPlus, { size: 'default', locale: zhCn });
app.use(contextmenu)

// 初始化状态管理
useBookmarkStore(pinia);
useAppStore(pinia);
useHotDataStore(pinia);

app.mount('#app');