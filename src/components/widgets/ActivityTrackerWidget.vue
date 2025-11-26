<template>
  <BaseWidget 
    :widget-id="widgetId" 
    :size="size"
    @resize="handleResize"
    @click="handleWidgetClick"
  >
    <div class="activity-tracker-widget" :class="{ 'half-size': size === 'half' }" @click.stop="handleWidgetClick">
      <div class="widget-header">
        <h3 class="widget-title">
          <Icon name="list" size="md" class="widget-icon" />
          Practice Tracker
        </h3>
        <div class="widget-stats">
          <span class="stat-item">{{ totalActivities }} practices</span>
          <span class="stat-item">{{ completedCount }} done</span>
        </div>
      </div>
      
      <div class="recent-activities">
        <div 
          v-if="recentActivities.length === 0" 
          class="empty-state"
        >
          <p class="empty-text">No practices yet</p>
          <p class="empty-hint">Tap to add practices</p>
        </div>
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="recent-activity"
          :class="{ 'completed': activity.completed }"
        >
          <span class="activity-check">{{ activity.completed ? '✓' : '○' }}</span>
          <div class="activity-details">
            <span class="activity-name">{{ activity.name }}</span>
            <span class="activity-child">{{ activity.childName }}</span>
          </div>
          <span class="activity-duration-badge">{{ activity.duration }}m</span>
        </div>
      </div>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from './BaseWidget.vue';
import Icon from '../Icon.vue';
import { activityTrackerStore } from '../../stores/activityTracker';
import { computed } from 'vue';

export default {
  name: 'ActivityTrackerWidget',
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
    const store = activityTrackerStore;
    
    const totalActivities = computed(() => store.totalCount.value);
    const completedCount = computed(() => store.completedCount.value);
    
    const recentActivities = computed(() => {
      // Get pending activities first, then completed
      const pending = [...store.pendingActivities.value].slice(0, 3);
      const completed = [...store.completedActivities.value].slice(0, 2);
      
      // Show up to 5 activities total
      const maxPending = Math.min(pending.length, 5);
      const maxCompleted = Math.max(0, 5 - maxPending);
      
      return [...pending.slice(0, maxPending), ...completed.slice(0, maxCompleted)];
    });
    
    const handleWidgetClick = () => {
      emit('navigate', 'ActivityTrackerView');
    };
    
    return {
      store,
      totalActivities,
      completedCount,
      recentActivities,
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
.activity-tracker-widget {
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

.widget-icon {
  flex-shrink: 0;
}

.half-size .widget-icon {
  font-size: 0.9em;
}

.widget-stats {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.85em;
}

.half-size .widget-stats {
  gap: var(--spacing-sm);
  font-size: 0.75em;
}

.stat-item {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.recent-activities {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  overflow-y: auto;
}

.half-size .recent-activities {
  gap: var(--spacing-xs);
}

.recent-activity {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  font-size: 0.9em;
  transition: opacity 0.2s ease;
}

.half-size .recent-activity {
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
  font-size: 0.8em;
}

.recent-activity.completed {
  opacity: 0.6;
}

.activity-check {
  width: 20px;
  text-align: center;
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.half-size .activity-check {
  width: 16px;
  font-size: 0.95em;
}

.activity-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.activity-name {
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.recent-activity.completed .activity-name {
  text-decoration: line-through;
}

.activity-child {
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.5);
}

.half-size .activity-child {
  font-size: 0.7em;
}

.activity-duration-badge {
  font-size: 0.75em;
  font-weight: 600;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.half-size .activity-duration-badge {
  font-size: 0.7em;
  padding: 1px 4px;
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

