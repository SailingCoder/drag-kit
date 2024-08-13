## 在 Vue3 中使用

### 在 Vue 项目中安装插件

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import userInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const app = createApp(App);

// 示例上传日志函数
const uploadLog: UploadLogFunction = (action, type, data) => {
  // 实现你的上传日志逻辑
  console.log(`Upload log: action=${action}, type=${type}, data=`, data);
  // 比如，上传操作的持续时间（duration）
  if (type === 'duration') {
    // fetch
  }
};

app.use(userInteractionTracker, {
  uploadLog,
  globalName: '$userTracker', // 可选，自定义全局变量名，默认为 '$userTracker'
  enabled: true, // 可选，是否启用，默认为 false  NODE_ENV === 'production'
});

app.mount('#app');
```

**注意：** 目前 type 支持`startAction`、`duration`、`endAction`三种类型。

1.  当 `type` 为 `startAction`时，表示这个动作是一个计时开始的动作。
2.  当 `type` 为 `duration`时，表示这个动作是一个持续性动作，有明确的开始时间和结束时间。（可以作为 duration 日志上传）
3.  当 `type` 为 `endAction`时，表示这个动作只是一个交互的动作，没有开始时间。（代表 duration 计算失败了，也可作为交互埋点上传）

### 在组件中使用

Vue 3 组件示例

```js
<template>
  <div>
    <button @click="handleStartAction">开始记录</button>
    <button @click="handleEndAction">结束记录</button>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted } from 'vue';

const tracker = getCurrentInstance()?.appContext.config.globalProperties.$userTracker;

// 开始操作
const handleStartAction = () => {
    tracker.startAction('action_name');
};

// 结束操作
const handleEndAction = () => {
    tracker.endAction('action_name');
};
</script>
```