# `drag-kit` - 可拖拽元素库

`drag-kit` 是一个轻量级的 JavaScript 库，用于实现元素的拖拽功能。它支持多种配置选项，包括初始位置、保存位置、拖拽区域限制、对齐方式等。这个库不仅适用于普通页面，还可以处理 iframe 中的拖拽需求。支持各个前端库，如vue、vue3、react


## 特性

- **基础拖拽**：可以拖拽指定的元素。
- **保存和恢复位置**：支持将拖拽位置保存到本地存储，并在页面加载时恢复。
- **iframe 兼容**：可以处理 iframe 内的拖拽情况，确保兼容性。
- **支持各个前端库**：支持Vue2、Vue3、React、JavaScript等前端库。

## 安装

```bash
npm install drag-kit
```

## 使用方法

### 基本用法

```javascript
import { createDraggable } from 'drag-kit';

createDraggable('draggableElementId', {
  initialPosition: { x: '100px', y: '100px' }, // 支持calc
});
```

### 参数说明

- **elementId**: 要使其可拖拽的元素的 ID。
- **options**: 配置选项对象，支持以下字段：
  - `initialPosition`: 元素的初始位置。
  - `shouldSave`: 是否将拖拽位置保存到本地存储。
  - `onDragStart`: 拖拽开始时的回调函数。
  - `onDrag`: 拖拽过程中的回调函数。
  - `onDragEnd`: 拖拽结束时的回调函数。

### 示例

在 HTML 文件中添加一个元素：

```html
<div id="draggableElementId" style="width: 100px; height: 100px; background: red; display: none">
  拖拽我
</div>
```

在 JavaScript 文件中调用 `createDraggable`：

```javascript
import { createDraggable } from 'drag-kit';

createDraggable('draggableElementId', {
  initialPosition: { x: '50px', y: '50px' },
  shouldSave: true,
  onDragStart: (e) => {
      console.log('onDragEnd', e.offsetLeft, e.offsetTop);
  },
  onDrag: (e) => {
      // console.log('onDrag', e);
  },
  onDragEnd: (e) => {
      console.log('onDragEnd', e.offsetLeft, e.offsetTop);
  },
});
```


文档更新中。。。

## 兼容性

- 现代浏览器（Chrome、Firefox、Safari、Edge）。
- 支持 iframe 内的拖拽功能。

