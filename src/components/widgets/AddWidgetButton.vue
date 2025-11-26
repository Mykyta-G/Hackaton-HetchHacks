<template>
  <div class="add-widget-container">
    <button
      class="add-widget-btn"
      @click.stop="toggleDropdown"
      @mousedown.stop
      draggable="false"
      :aria-label="'Add widget'"
    >
      <span class="add-icon">+</span>
    </button>
    
    <div 
      v-if="showDropdown" 
      class="dropdown-menu"
      @click.stop
    >
      <button
        v-for="widgetType in availableWidgetTypes"
        :key="widgetType.type"
        class="dropdown-item"
        @click="handleAddWidget(widgetType.type)"
      >
        <Icon :name="widgetType.icon" size="md" class="item-icon" />
        <span class="item-label">{{ widgetType.label }}</span>
      </button>
    </div>
    
    <div 
      v-if="showDropdown" 
      class="dropdown-backdrop"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
import Icon from '../Icon.vue';

export default {
  name: 'AddWidgetButton',
  components: {
    Icon
  },
  emits: ['add-widget'],
  data() {
    return {
      showDropdown: false,
      availableWidgetTypes: [
        { type: 'shopping-list', label: 'Shopping List', icon: 'shopping-cart' },
        { type: 'meal-countdown', label: 'Meal Countdown', icon: 'utensils' },
        { type: 'todo-list', label: 'Todo List', icon: 'check-square' },
        { type: 'activity-tracker', label: 'Activity Tracker', icon: 'list' },
        { type: 'placeholder', label: 'Placeholder (Testing)', icon: 'box' }
      ]
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown() {
      this.showDropdown = false;
    },
    handleAddWidget(type) {
      this.$emit('add-widget', type);
      this.closeDropdown();
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.add-widget-container {
  position: fixed;
  bottom: 100px; /* Above nav bar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1003; /* Above nav (1000) and widgets (1002) */
  pointer-events: auto;
}

.add-widget-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--secondary-color);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 28px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.add-widget-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  background: rgba(0, 120, 167, 0.9);
}

.add-widget-btn:active {
  transform: scale(0.95);
}

.add-icon {
  line-height: 1;
  display: block;
}

.dropdown-menu {
  position: absolute;
  bottom: 70px; /* Above the button */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 53, 89, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm);
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
  font-size: 0.95em;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-item:active {
  background: rgba(255, 255, 255, 0.15);
}

.item-icon {
  font-size: 1.2em;
  width: 24px;
  text-align: center;
}

.item-label {
  flex: 1;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;
  background: transparent;
}

/* Responsive adjustments */
@media (max-width: 400px) {
  .dropdown-menu {
    min-width: 180px;
  }
}
</style>

