<template>
  <div>
    <UserTrackerComponent />
    <UserTracker />
  </div>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';
import UserTrackerComponent from './page/UserTrackerComponent.vue';
import UserTracker from './page/UserTracker.vue';

</script>
