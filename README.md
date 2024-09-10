# `drag-kit` - 轻量级可拖拽元素库

`drag-kit` 是一个轻量级的 JavaScript 库，旨在实现元素的拖拽功能。它提供了多种配置选项，包括初始位置、位置保存、拖拽区域限制、网格对齐和自动吸附等功能。该库不仅处理了内嵌 iframe 带来的拖拽问题，还兼容 Vue 2、Vue 3 和 React 等主流前端框架。

![npm version](https://img.shields.io/npm/v/drag-kit)

[English](https://github.com/SailingCoder/drag-kit/blob/main/doc/README_EN.md)

## 特性

- **基础拖拽**：支持拖拽指定元素。
- **方向锁定**：支持锁定拖拽方向（水平或垂直）。
- **网格对齐**：支持拖拽时对齐到指定网格。
- **自动吸附**：支持将元素自动吸附到视口边缘。
- **边缘缓冲**：支持设置元素与边缘的缓冲距离。
- **边界限制**：支持防止元素拖动超出指定区域。
- **保存和恢复位置**：支持将拖拽位置保存到本地存储，并在页面加载时恢复。
- **iframe 兼容**：处理 iframe 内的拖拽问题，确保兼容性。
- **支持多种前端框架**：适用于 Vue 2、Vue 3、React 等前端框架。

## 安装

```bash
npm install drag-kit
```

## 使用方法

### 基本用法

```javascript
import { createDraggable } from 'drag-kit';

createDraggable('draggableElementId', {
  initialPosition: { x: '100px', y: '100px' }, // 可选，支持 calc
});
```

### 参数说明

- **elementId**: 要使其可拖拽的元素的 ID。（必填）
- **options**: 配置选项对象，支持以下字段：（选填）
  - `mode` (`'screen' | 'page' | 'container'`): 拖动模式（屏幕、页面或容器），默认是 `screen`。详见下文。
  - `initialPosition`: 元素的初始位置，默认 x = 0，y = 0。
  - `dragArea` (`HTMLElement`): 拖动区域（默认为 `null`，即全屏）。如果 `mode` 为 `container`，则需要设置该参数。
  - `lockAxis` (`'x' | 'y' | 'none'`): 锁定拖动轴（x 轴、y 轴或无）。
  - `edgeBuffer` (`number`): 边缘缓冲区。
  - `gridSize` (`number`): 拖动网格大小（默认为 `undefined`，即无网格对齐）。
  - `snapMode` (`'none' | 'auto' | 'right' | 'left' | 'top' | 'bottom'`): 自动吸附模式，默认为 `none`。
  - `shouldSave`: 是否将拖拽位置保存到本地存储。
  - `onDragStart`: 拖拽开始时的回调函数。
  - `onDrag`: 拖拽过程中的回调函数。
  - `onDragEnd`: 拖拽结束时的回调函数。

#### `mode` 参数详细说明

`mode` 参数定义了拖拽元素的拖动区域，决定了拖拽元素可以移动的范围：

1. **`screen` 模式**  
   元素只能在当前 **可视区域** 内拖拽，拖动范围受到屏幕边界限制。适用于需要固定在屏幕上的 UI 元素，如对话框、工具栏等。

2. **`page` 模式**  
   元素可以在整个 **页面范围** 内拖动，不受视口限制，即使页面有滚动条，元素也能被拖动到页面的任意位置，超出当前可视区域的部分可以通过滚动显示。

3. **`container` 模式**  
   元素只能在指定的 **容器** 内拖动，拖动区域受到容器边界的限制。通过设置 `dragArea` 参数来指定容器元素。适合局部拖动的场景，如面板或对话框内部的元素拖动。

### Vue3 示例

```html
<template>
    <div class="example-container">
        <h1 style="padding-top: 80px;">拖拽示例</h1>
    
        <!-- 基本拖拽功能（screen 模式） -->
        <div id="draggable-screen" class="draggable" ref="basic">
            基本拖拽
        </div>
    
        <!-- 页面范围模式（page 模式） -->
        <div id="draggable-page" class="draggable" ref="page">
            页面模式拖拽
        </div>
    
        <!-- 设置边界 -->
        <div id="drag-container">
            <div id="draggable-bounds" class="draggable" ref="bounds">
                容器内拖拽
            </div>
        </div>
    
        <!-- 锁定 x 轴拖拽 -->
        <div id="draggable-x-axis" class="draggable" ref="yAxis">
            锁定 Y 轴拖拽
        </div>
    
        <!-- 网格模式拖拽 -->
        <div id="draggable-grid" class="draggable" ref="grid">
            网格对齐拖拽
        </div>

        <!-- 吸附模式 (screen 模式下) -->
        <div id="draggable-snap" class="draggable" ref="snap">
            吸附模式拖拽
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { createDraggable } from 'drag-kit';

const basic = ref<HTMLElement | null>(null);
const page = ref<HTMLElement | null>(null);
const bounds = ref<HTMLElement | null>(null);
const yAxis = ref<HTMLElement | null>(null);
const grid = ref<HTMLElement | null>(null);
const snap = ref<HTMLElement | null>(null); // 新增吸附示例
  
onMounted(() => {
    // 基本拖拽功能
    createDraggable(basic.value!.id);
  
    // 页面模式拖拽
    createDraggable(page.value!.id, {
        mode: 'page',
        initialPosition: { x: '0px', y: '200px' },
    });
  
    // 设置边界
    createDraggable(bounds.value!.id, {
        mode: 'container',
        dragArea: document.getElementById('drag-container')!, // 拖拽区域为指定元素
        edgeBuffer: 20,          // 设置缓冲区域，防止超出边界
    });

    // 锁定 x 轴拖拽
    createDraggable(yAxis.value!.id, { 
        lockAxis: 'y', 
        initialPosition: { x: '0px', y: '400px' } 
    });
  
    // 网格模式拖拽
    createDraggable(grid.value!.id, {
        gridSize: 50,  
        // snapMode: 'auto', // 拖拽时每 50px 吸附
        initialPosition: { x: '0px', y: '600px' },
    });

    // 吸附模式拖拽 (screen 模式下)
    createDraggable(snap.value!.id, {
      mode: 'screen', // 使用 screen 模式
      snapMode: 'auto',
      initialPosition: { x: 'calc(100vw - 230px)', y: '0' },
    });
});
</script>
<style scoped>
.example-container {
    height: 1000px;
}
.draggable {
    width: 230px;
    height: 100px;
    line-height: 40px;
    background-color: lightcoral;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    z-index: 111;
}
#drag-container {
    width: 500px;
    height: 300px;
    background: yellow;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
```