<template>
  <div class="nav br-15">
    <a @click.prevent="navigateTo('HomeView')" class="nav-item" :class="{ active: isNavView && currentView === 'HomeView' }">
      <svg ref="homeIconRef" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
      <span class="nav-text">Home</span>
      <div class="nav-underline"></div>
    </a>
    <a @click.prevent="navigateTo('ProfileView')" class="nav-item" :class="{ active: isNavView && currentView === 'ProfileView' }">
      <svg ref="profileIconRef" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
      <span class="nav-text">Profile</span>
      <div class="nav-underline"></div>
    </a>
    <a @click.prevent="navigateTo('SettingsView')" class="nav-item" :class="{ active: isNavView && currentView === 'SettingsView' }">
      <svg ref="settingsIconRef" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
      <span class="nav-text">Settings</span>
      <div class="nav-underline"></div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  props: {
    currentView: {
      type: String,
      default: 'HomeView'
    }
  },
  emits: ['navigate'],
  computed: {
    isNavView() {
      return ['HomeView', 'ProfileView', 'SettingsView'].includes(this.currentView);
    }
  },
  mounted() {
    this.setIconContent(this.$refs.homeIconRef, this.getHomeIcon());
    this.setIconContent(this.$refs.profileIconRef, this.getProfileIcon());
    this.setIconContent(this.$refs.settingsIconRef, this.getSettingsIcon());
  },
  methods: {
    navigateTo(view) {
      this.$emit('navigate', view);
    },
    setIconContent(svgElement, content) {
      if (svgElement) {
        svgElement.innerHTML = content;
      }
    },
    getHomeIcon() {
      return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>';
    },
    getProfileIcon() {
      return '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>';
    },
    getSettingsIcon() {
      return '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>';
    }
  }
};
</script>

<style scoped>
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--nav-background, rgba(0, 126, 167, 0.7));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  margin: 10px;
  padding: 10px;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 23, 31, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
  max-width: 120px;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item:active {
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  display: block;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s ease;
}

.nav-item:hover .nav-icon {
  color: rgba(255, 255, 255, 1);
}

.nav-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.3px;
}

.nav-underline {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-item.active .nav-underline {
  width: 60%;
}

.nav-item.active .nav-icon {
  color: rgba(255, 255, 255, 1);
}

.nav-item.active .nav-text {
  color: rgba(255, 255, 255, 1);
}
</style>