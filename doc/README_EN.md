# User Interaction Tracker

The User Interaction Tracker is a library for tracking user behavior and time. It provides a lightweight way to record user interactions, supporting Vue 2, Vue 3, React, and other JavaScript frameworks. It offers a flexible API and plugin mechanism for easy integration into various projects, allowing you to track the start and end times of operations, as well as the duration of those operations.

![npm version](https://img.shields.io/npm/v/user-interaction-tracker)

[中文](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_CN.md)

## Features

* Track the start and end times of user actions
* Calculate and record the duration of actions
* Support for custom log upload functions
* Usable in Vue 2, Vue 3, React projects, and other frameworks (e.g., jQuery or plain JavaScript)
* Simple operations: `startAction`, `endAction`, with support for multiple trackers

## Installation

Install via npm:

```bash
npm install user-interaction-tracker
```

Install via yarn:

```bash
yarn add user-interaction-tracker
```

## Basic Example (Vue 3)

### Register the Plugin in `main.ts`

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import userInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const app = createApp(App);

const uploadLog: UploadLogFunction = (action, type, data) => {
  console.log(`Action: ${action}, Type: ${type}`, data);
};

app.use(userInteractionTracker, {
  uploadLog,
  globalName: '$userTracker', // Optional, default is '$userTracker'
  enabled: true // Optional, default is false
});

app.mount('#app');
```

### Using in a Component

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

## Detailed Examples

1. [Detailed Example for Vue 2](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_EN_VUE2.md)
2. [Detailed Example for Vue 3](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_EN_VUE3.md)
3. [Detailed Example for React](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_EN_REACT.md)
4. [Detailed Examples for Other Frameworks (e.g., jQuery or Plain JavaScript)](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_EN_OTHER.md)

## Configuration Options

| Parameter       | Type    | Description                                   | Default Value       |
| --------------- | ------- | --------------------------------------------- | ------------------- |
| `uploadLog`     | Function | Function for uploading logs, receiving three parameters: `action` (operation name), `type` (operation type), `data` (operation data) | Required            |
| `enabled`       | Boolean  | Whether to enable the tracker                 | `false`             |
| `globalName`    | String   | Name of the global property in Vue instance for the tracker | `$userTracker` |

## API

| Method                     | Description                                 | Parameters                                    | Returns         |
| -------------------------- | ------------------------------------------- | --------------------------------------------- | --------------- |
| `startAction(action: string, options?: any)` | Start recording an action | `action` (string): Operation name<br>`options` (optional, any): Additional information for starting the action | None            |
| `endAction(action: string, options?: any)`   | End recording an action | `action` (string): Operation name<br>`options` (optional, any): Additional information for ending the action | None            |
| `getPendingActions(action?: string)`          | Get pending actions. If `action` is provided, returns details of that action; otherwise, returns all pending actions. | `action` (optional, string): Operation name | Object or Array |
| `clearActions(actions?: string[]): void`     | Clear specified action records. If no parameters are provided, clears all action records. | `actions` (optional, array): Array of operation names to clear | None            |

`UploadLogFunction`

```typescript
type UploadLogFunction = (
  action: string,
  type: 'duration' | 'endAction' | 'startAction',
  data?: {
    duration: number,
    start: number | null,
    end: number | null,
    startOptions: any,
    endOptions: any,
  }
) => void;
```

## Contributing

Feel free to open issues, report bugs, or request new features. Please submit them in the [GitHub Issues](https://github.com/SailingCoder/user-interaction-tracker/issues).

## License

MIT License. See the [LICENSE](https://github.com/SailingCoder/user-interaction-tracker/blob/main/LICENSE) file for more details.