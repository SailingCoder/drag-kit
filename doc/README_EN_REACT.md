## Using `UserInteractionTracker` in React

### Setting Up `userTracker.ts`

```typescript
// userTracker.ts
import UserInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const uploadLog: UploadLogFunction = (action, type, data) => {
  console.log(`Action: ${action}, Type: ${type}`, data);
};

const userTracker = new UserInteractionTracker({
  uploadLog,
  enabled: true // Optional, defaults to false
});

export { userTracker };
```

**Note:** Currently, `type` supports three types: `startAction`, `duration`, and `endAction`.

1. When `type` is `startAction`, it indicates that this action marks the beginning of a timing event.
2. When `type` is `duration`, it signifies a continuous action with a defined start and end time. (This can be uploaded as a duration log.)
3. When `type` is `endAction`, it represents an interaction action without a start time. (This indicates a failed duration calculation and can also be used for interaction tracking.)

### Using in Your Component

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

In the `App.tsx` component, you can use the `userTracker` instance to call the `startAction` and `endAction` methods. This allows you to track user interactions effectively within your React application. By implementing these methods, you can gain insights into user behavior and interaction patterns, which can be valuable for analytics and improving user experience.