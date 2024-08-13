## 其他框架示例（如 jQuery 或原生 JavaScript）

### 超级简单

#### 创建userTracker.js

```javascript
import UserInteractionTracker from 'user-interaction-tracker';

const userTracker = new UserInteractionTracker({
  uploadLog: (action, type, data) => {
    console.log(`Action: ${action}, Type: ${type}`, data);
  },
  enabled: true // 可选，默认为 false
});

export { userTracker };
```

#### 使用

```javascript
import { userTracker } from './userTracker.js';

function handleStartAction() {
  // 开始一个交互
  userTracker.startAction('someAction');
}

function handleEndAction() {
  // 结束一个交互
  userTracker.endAction('someAction');
}
```

此示例展示了如何在 jQuery 或原生 JavaScript 项目中使用 `user-interaction-tracker` 库。您可以轻松地集成和使用该库来跟踪用户的交互操作。