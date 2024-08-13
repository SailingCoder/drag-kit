## Using `UserInteractionTracker` in Vue 2

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

Example Vue 2 Component

```html
<template>
  <div>
    <button @click="handleStartAction">Start Tracking</button>
    <button @click="handleEndAction">End Tracking</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleStartAction() {
        this.$userTracker.startAction('action_name');
    },
    handleEndAction() {
        this.$userTracker.endAction('action_name');
    },
  }
};
</script>
```

In this example, you can use `this.$userTracker` to call the `startAction` and `endAction` methods in your Vue 2 component. This setup allows you to effectively track user interactions and analyze behavior within your Vue application.