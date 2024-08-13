## Using `UserInteractionTracker` in Vue 3

### Installing the Plugin in Your Vue Project

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import userInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const app = createApp(App);

// Example upload log function
const uploadLog: UploadLogFunction = (action, type, data) => {
  // Implement your log upload logic here
  console.log(`Upload log: action=${action}, type=${type}, data=`, data);
  // For example, handle duration logs
  if (type === 'duration') {
    // Fetch or other network operations
  }
};

app.use(userInteractionTracker, {
  uploadLog,
  globalName: '$userTracker', // Optional, custom global variable name, default is '$userTracker'
  enabled: true, // Optional, whether to enable, default is false in NODE_ENV === 'production'
});

app.mount('#app');
```

**Note:** Currently, `type` supports three types: `startAction`, `duration`, and `endAction`.

1. When `type` is `startAction`, it indicates that this action marks the beginning of a timing event.
2. When `type` is `duration`, it represents a continuous action with a defined start and end time. (Can be uploaded as a duration log.)
3. When `type` is `endAction`, it represents an interaction action without a start time. (Indicates a failed duration calculation and can also be used for interaction tracking.)

### Using in Your Component

Example Vue 3 Component

```html
<template>
  <div>
    <button @click="handleStartAction">Start Tracking</button>
    <button @click="handleEndAction">End Tracking</button>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue';

const tracker = getCurrentInstance()?.appContext.config.globalProperties.$userTracker;

// Start action
const handleStartAction = () => {
    tracker.startAction('action_name');
};

// End action
const handleEndAction = () => {
    tracker.endAction('action_name');
};
</script>
```

In this Vue 3 example, you use the `getCurrentInstance()` function to access the global properties where `userTracker` is registered. The `handleStartAction` and `handleEndAction` methods allow you to start and end user interaction tracking, respectively. This setup helps you effectively track and analyze user interactions within your Vue 3 application.