<template>
  <DraggableExample />
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';
import DraggableExample from './components/DraggableExample.vue';
import './styles/reset.css';

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>