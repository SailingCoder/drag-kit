<template>
    <div>
        <div id="draggableElementId" style="width: 100px; height: 100px; background: red; display: none;">
            拖拽我
        </div>
        <div id="dragArea" style="width: 500px; height: 500px; background-color: yellow;position: relative;display: none;">
            拖拽区域
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject, computed } from 'vue';
import { createDraggable } from '../../package/index';

onMounted(() => {
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
        // dragArea: document.getElementById('dragArea'),
        // lockAxis: 'y',
        // edgeBuffer: 20,
        // gridSize: 10,
        // mode: 'restricted',
        // snapMode: 'auto'
    });
});
</script>

<style lang="less" scoped>
.container {
    display: flex;
    justify-content: center;
    .user-content {
        width: 800px;
        display: flex;
        margin-top: 100px;
        align-items: center;
        .user-row {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
.box {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    button {
        padding: 10px 20px;
        border: 1px solid #1890ff;
        border-radius: 5px;
        background-color: #fff;
        cursor: pointer;
        font-size: 16px;
        color: #1890ff;
        font-weight: bold;
        margin-right: 10px;
    }
}
</style>
  