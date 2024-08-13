import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './src/App.vue';
import userInteractionTrackerPlugin from './package/index'; // 引用你的库
import { useUserTrackerStore } from '@/stores/userTrackerStore'; // 引用你的库


const app = createApp(App);
const pinia = createPinia();
app.use(pinia)
app.use(userInteractionTrackerPlugin, {
  enabled: true, // NODE_ENV === 'production'
  globalName: '$userTracker',
  uploadLog: (action: string, type: 'duration'|'startAction'|'endAction', data: any) => {
      console.log('uploadLog', action, type, data)
      // 本地调试
      useUserTrackerStore().updateTrackerData(action, type, data);
      // 上传日志
      if (type === 'duration') {
        // fetch('/api/log')
      }
  }
})

app.mount('#app');
