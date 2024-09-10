<template>
    <div class="example-container">
        <h1 style="padding-top: 80px;">Draggable Examples</h1>
    
        <!-- 基本拖拽功能（screen模式） -->
        <div id="draggable-screen" class="draggable" ref="basic">
            Basic Draggable
        </div>
    
        <!-- 页面范围模式（page模式） -->
        <div id="draggable-page" class="draggable" ref="page">
            Draggable in Page Mode
        </div>
    
        <!-- 设置边界 -->
        <div id="drag-container">
            <div id="draggable-bounds" class="draggable" ref="bounds">
                Draggable with Container Area
            </div>
        </div>
    
        <!-- 锁定 x 轴拖拽 -->
        <div id="draggable-x-axis" class="draggable" ref="yAxis">
            Draggable on Y Axis
        </div>
    
        <!-- 网格模式拖拽 -->
        <div id="draggable-grid" class="draggable" ref="grid">
            Draggable with Grid
        </div>

        <!-- 吸附模式 (screen模式下) -->
        <div id="draggable-snap" class="draggable" ref="snap">
            Draggable with Snap
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { createDraggable } from '@/drag/index';

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

    // 吸附模式拖拽 (screen模式下)
    createDraggable(snap.value!.id, {
      mode: 'screen', // 使用screen模式
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