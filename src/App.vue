<template>
  <div id="app">
    <component :is="currentView" :currentView="currentView" @navigate="navigateTo" />
  </div>
</template>

<script>
import { ref } from 'vue';
import HomeView from './views/HomeView.vue';
import ShoppingListView from './views/ShoppingListView.vue';
import MealCountdownView from './views/MealCountdownView.vue';
import TodoListView from './views/TodoListView.vue';
import ActivityTrackerView from './views/ActivityTrackerView.vue';
import ProfileView from './views/ProfileView.vue';
import SettingsView from './views/SettingsView.vue';

export default {
  name: 'App',
  components: {
    HomeView,
    ShoppingListView,
    MealCountdownView,
    TodoListView,
    ActivityTrackerView,
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
  mounted() {
    // Apply saved theme on app load
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const themes = {
        default: {
          primary: '#00a8e8',
          secondary: '#007ea7',
          tertiary: '#003459',
          background: '#00171f'
        },
        dark: {
          primary: '#00171f',
          secondary: '#003459',
          tertiary: '#00171f',
          background: '#000000'
        },
        ocean: {
          primary: '#007ea7',
          secondary: '#003459',
          tertiary: '#00171f',
          background: '#000d14'
        },
        sunset: {
          primary: '#ff6b6b',
          secondary: '#ffa500',
          tertiary: '#cc5500',
          background: '#2d1b0e'
        }
      };
      
      const theme = themes[savedTheme];
      if (theme) {
        const root = document.documentElement;
        root.style.setProperty('--fresh-sky', theme.primary);
        root.style.setProperty('--cerulean', theme.secondary);
        root.style.setProperty('--deep-space-blue', theme.tertiary);
        root.style.setProperty('--ink-black', theme.background);
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--tertiary-color', theme.tertiary);
        root.style.setProperty('--background-dark', theme.background);
        
        // Update navbar background with 70% opacity
        const hexToRgba = (hex, alpha) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        root.style.setProperty('--nav-background', hexToRgba(theme.secondary, 0.7));
      }
    }
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
