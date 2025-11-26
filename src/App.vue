<template>
  <div id="app">
    <router-view />
    <Nav />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Nav from './components/nav.vue';
export default defineComponent({
  name: 'App',
  components: {
    Nav,
  },
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

