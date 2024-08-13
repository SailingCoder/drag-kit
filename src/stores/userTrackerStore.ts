import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserTrackerStore = defineStore('userTracker', () => {
  const userTrackerData = ref({ action: '', type: '', data: {} });

  function updateTrackerData(action: string, type: string, data: any) {
    userTrackerData.value = { action, type, data };
  }

  return { userTrackerData, updateTrackerData };
});
