<template>
    <div class="container">
        <div class="user-content">
            <div class="user-row">
                <p>UserTrackerComponent Vue</p>
                <p>当前未完成的操作数量: {{ pendingActionsCount }}</p>
                <div>
                    <div class="box">
                        <button @click="handleStartAction">StartAction</button>
                        <button @click="handleEndAction">EndAction</button>
                    </div>
                </div>
            </div>
            <div class="user-row">
                <p>用户跟踪数据: <pre>{{ userTrackerData }}</pre></p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, inject, computed } from 'vue';
import { useUserTrackerStore } from '@/stores/userTrackerStore';
const userTrackerStore = useUserTrackerStore();


const tracker = getCurrentInstance()?.appContext.config.globalProperties.$userTracker;

// 反应式数据
const pendingActionsCount = ref(0);
// computed  serTrackerStore.userTrackerData
const userTrackerData = computed(() => userTrackerStore.userTrackerData);

// 获取未完成操作的数量
const getPendingActions = () => {
    pendingActionsCount.value = Object.keys(tracker.getPendingActions()).length;
};

// 开始操作
const handleStartAction = () => {
    tracker.startAction('action_name');
    getPendingActions();
};

// 结束操作
const handleEndAction = () => {
    tracker.endAction('action_name', { code: 'success' });
    getPendingActions();
};

// 组件挂载时获取未完成操作数量
onMounted(() => {
    getPendingActions();
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
  