<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
@import './main.css';

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

#app {
  padding: 10px;
  width: 100%;
  height: 100vh;
  background: var(--primary-color);
}
</style>
