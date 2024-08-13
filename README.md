# `drag-kit` - 可拖拽元素库

`drag-kit` 是一个轻量级的 JavaScript 库，用于实现元素的拖拽功能。它支持多种配置选项，包括初始位置、保存位置、拖拽区域限制、对齐方式等。这个库不仅适用于普通页面，还可以处理 iframe 中的拖拽需求。支持各个前端库，如vue、vue3、react

## 特性

- **基础拖拽**：可以拖拽指定的元素。
- **方向锁定**：支持锁定拖拽的方向（水平或垂直）。
- **自动对齐**：支持拖拽结束时自动对齐到视口边缘。
- **边缘缓冲**：可以设置元素与边缘的缓冲距离。
- **网格模式**：拖拽时可以对齐到指定网格。
- **保存和恢复位置**：支持将拖拽位置保存到本地存储，并在页面加载时恢复。
- **多模式支持**：支持视口模式、固定模式和限制模式。
- **iframe 兼容**：可以处理 iframe 内的拖拽情况，确保兼容性。

## 安装

```bash
npm install drag-kit
```

## 使用方法

### 基本用法

```javascript
import { createDraggable } from 'drag-kit';

const draggable = createDraggable('draggableElementId', {
  initialPosition: { x: '100px', y: '100px' }, // 支持calc
  shouldSave: true,
  dragArea: document.getElementById('dragArea'),
  lockAxis: 'x',
  edgeBuffer: 10,
  gridSize: 20,
  mode: 'viewport',
  snapMode: 'auto'
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
  - `dragArea`: 拖拽区域的元素（仅在模式为 `restricted` 时有效）。
  - `lockAxis`: 锁定拖拽的方向（`x` 或 `y`）。
  - `edgeBuffer`: 边缘缓冲距离（像素）。
  - `gridSize`: 网格对齐的大小（像素）。
  - `mode`: 拖拽模式（`viewport`、`fixed` 或 `restricted`）。
  - `snapMode`: 拖拽结束时的对齐方式（`none`、`auto`、`right`、`left`、`top`、`bottom`）。

### 示例

在 HTML 文件中添加一个元素：

```html
<div id="draggableElementId" style="width: 100px; height: 100px; background: red; display: none">
  拖拽我
</div>
<div id="dragArea" style="width: 100%; height: 100%; position: relative; display: none;">
  拖拽区域
</div>
```

在 JavaScript 文件中调用 `createDraggable`：

```javascript
import { createDraggable } from 'drag-kit';

const draggable = createDraggable('draggableElementId', {
  initialPosition: { x: '50px', y: '50px' },
  shouldSave: true,
  dragArea: document.getElementById('dragArea'),
  lockAxis: 'y',
  edgeBuffer: 20,
  gridSize: 10,
  mode: 'restricted',
  snapMode: 'auto'
});
```

## 兼容性

- 现代浏览器（Chrome、Firefox、Safari、Edge）。
- 支持 iframe 内的拖拽功能。

