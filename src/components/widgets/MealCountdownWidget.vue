<template>
  <BaseWidget 
    :widget-id="widgetId" 
    :size="size"
    @resize="handleResize"
    @click="handleWidgetClick"
  >
    <div class="meal-countdown-widget" :class="{ 'half-size': size === 'half' }" @click.stop="handleWidgetClick">
      <div class="widget-header">
        <h3 class="widget-title">
          <Icon :name="mealIconName" size="md" class="widget-icon" />
          <span class="widget-title-text">{{ mealTypeLabel }}</span>
        </h3>
        <div class="widget-status" :class="{ active: store.state.isActive }">
          <span class="status-dot"></span>
          <span class="status-text">{{ store.state.isActive ? 'Active' : 'Inactive' }}</span>
        </div>
      </div>
      
      <div class="countdown-content">
        <div v-if="store.state.isActive && store.timeRemaining" class="countdown-display">
          <div class="countdown-message">{{ store.state.message }}</div>
          <div class="countdown-time">{{ store.formattedTimeRemaining }}</div>
          <div class="countdown-human">{{ store.humanReadableTimeRemaining }}</div>
        </div>
        <div v-else class="empty-state">
          <p class="empty-text">No active countdown</p>
          <p class="empty-hint">Tap to configure</p>
        </div>
      </div>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from './BaseWidget.vue';
import Icon from '../Icon.vue';
import { mealCountdownStore } from '../../stores/mealCountdown';
import { computed } from 'vue';

export default {
  name: 'MealCountdownWidget',
  components: {
    BaseWidget,
    Icon
  },
  props: {
    widgetId: {
      type: [String, Number],
      required: true
    },
    size: {
      type: String,
      default: 'full',
      validator: (value) => ['half', 'full'].includes(value)
    }
  },
  emits: ['resize', 'navigate'],
  setup(props, { emit }) {
    const store = mealCountdownStore;
    
    const mealIconName = computed(() => {
      return store.state.mealType === 'lunch' ? 'coffee' : 'utensils';
    });
    
    const mealTypeLabel = computed(() => {
      return store.state.mealType === 'lunch' ? 'Lunch' : 'Dinner';
    });
    
    const handleWidgetClick = () => {
      emit('navigate', 'MealCountdownView');
    };
    
    return {
      store,
      mealIconName,
      mealTypeLabel,
      handleWidgetClick
    };
  },
  methods: {
    handleResize({ widgetId, newSize }) {
      this.$emit('resize', { widgetId, newSize });
    }
  }
};
</script>

<style scoped>
.meal-countdown-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
  cursor: pointer;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.half-size .widget-header {
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.widget-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.half-size .widget-title {
  font-size: 1em;
}

.widget-title-text {
  flex: 1;
}

.widget-icon {
  font-size: 1.1em;
}

.half-size .widget-icon {
  font-size: 0.9em;
}

.widget-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.5);
}

.widget-status.active {
  color: rgba(0, 200, 100, 0.9);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

.widget-status.active .status-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-weight: 500;
}

.countdown-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 0;
}

.countdown-display {
  width: 100%;
  text-align: center;
}

.countdown-message {
  font-size: 0.9em;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-md);
}

.half-size .countdown-message {
  font-size: 0.8em;
  margin-bottom: var(--spacing-sm);
}

.countdown-time {
  font-size: 2.5em;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: white;
  margin-bottom: var(--spacing-sm);
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  line-height: 1;
}

.half-size .countdown-time {
  font-size: 1.8em;
}

.countdown-human {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.6);
}

.half-size .countdown-human {
  font-size: 0.8em;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-lg) 0;
  opacity: 0.6;
}

.half-size .empty-state {
  padding: var(--spacing-md) 0;
}

.empty-text {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 0.95em;
  color: rgba(255, 255, 255, 0.8);
}

.half-size .empty-text {
  font-size: 0.85em;
}

.empty-hint {
  margin: 0;
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
}

.half-size .empty-hint {
  font-size: 0.75em;
}
</style>

