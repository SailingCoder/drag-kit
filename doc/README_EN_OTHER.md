## Other Framework Examples (e.g., jQuery or Plain JavaScript)

### Super Simple

#### userTracker.js

```javascript
import UserInteractionTracker from 'user-interaction-tracker';

const userTracker = new UserInteractionTracker({
  uploadLog: (action, type, data) => {
    console.log(`Action: ${action}, Type: ${type}`, data);
  },
  enabled: true // Optional, default is false
});

export { userTracker };
```

#### Usage Example

```javascript
import { userTracker } from './userTracker.js';

function handleStartAction() {
  // Start tracking an interaction
  userTracker.startAction('someAction');
}

function handleEndAction() {
  // End tracking an interaction
  userTracker.endAction('someAction');
}
```

This example demonstrates how to use the `user-interaction-tracker` library in a jQuery or plain JavaScript project. You can easily integrate and use this library to track user interactions.