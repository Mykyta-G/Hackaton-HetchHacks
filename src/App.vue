<template>
  <div id="app">
    <component :is="currentView" :currentView="currentView" @navigate="navigateTo" />
  </div>
</template>

<script>
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import ShoppingListView from './views/ShoppingListView.vue';
import ProfileView from './views/ProfileView.vue';
import SettingsView from './views/SettingsView.vue';

export default {
  name: 'App',
  components: {
    HomeView,
    ShoppingListView,
    ProfileView,
    SettingsView,
  },
  setup() {
    const currentView = ref('HomeView');

    const navigateTo = (view) => {
      currentView.value = view;
    };

    return {
      currentView,
      navigateTo,
    };
  },
};
</script>

<style>
@import './main.css';

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--primary-color);
}

html {
  background: var(--primary-color);
}

#app {
  padding: 0;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  min-height: 100vh;
  background: var(--primary-color);
  overflow-x: hidden;
}
</style>
