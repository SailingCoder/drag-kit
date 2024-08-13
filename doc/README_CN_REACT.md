## 在 React 中使用

### 创建 `userTracker.ts`

```typescript
// userTracker.ts
import UserInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const uploadLog: UploadLogFunction = (action, type, data) => {
  console.log(`Action: ${action}, Type: ${type}`, data);
};

const userTracker = new UserInteractionTracker({
  uploadLog,
  enabled: true // 可选，默认为 false
});

export { userTracker };
```

**注意：** 目前 `type` 支持 `startAction`、`duration`、`endAction` 三种类型：

1. 当 `type` 为 `startAction` 时，表示这个动作是一个计时开始的动作。
2. 当 `type` 为 `duration` 时，表示这个动作是一个持续性动作，有明确的开始时间和结束时间。（可以作为 duration 日志上传）
3. 当 `type` 为 `endAction` 时，表示这个动作只是一个交互的动作，没有开始时间。（代表 duration 计算失败了，也可作为交互埋点上传）

### 在你的组件中使用

```typescript
// App.tsx
import React from 'react';
import { userTracker } from './userTracker';

const App: React.FC = () => {
  const handleStartAction = () => {
    userTracker.startAction('someAction');
  };

  const handleEndAction = () => {
    userTracker.endAction('someAction');
  };

  return (
    <div>
      <button onClick={handleStartAction}>Start Action</button>
      <button onClick={handleEndAction}>End Action</button>
    </div>
  );
}

export default App;
```

在 `App.tsx` 中，你可以通过 `userTracker` 实例调用 `startAction` 和 `endAction` 方法来记录用户的交互动作。这样可以帮助你在应用中有效地跟踪和分析用户行为。