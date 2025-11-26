<template>
  <BaseWidget 
    :widget-id="widgetId" 
    :size="size"
    @resize="handleResize"
    @click="handleWidgetClick"
  >
    <div class="todo-list-widget" :class="{ 'half-size': size === 'half' }" @click.stop="handleWidgetClick">
      <div class="widget-header">
        <h3 class="widget-title">
          <Icon name="check-square" size="md" class="widget-icon" />
          Todo List
        </h3>
        <div class="widget-stats">
          <span class="stat-item">{{ totalTasks }} tasks</span>
          <span class="stat-item">{{ completedCount }} done</span>
        </div>
      </div>
      
      <div class="recent-tasks">
        <div 
          v-if="recentTasks.length === 0" 
          class="empty-state"
        >
          <p class="empty-text">No tasks yet</p>
          <p class="empty-hint">Tap to add tasks</p>
        </div>
        <div 
          v-for="task in recentTasks" 
          :key="task.id"
          class="recent-task"
          :class="{ 'completed': task.completed, [`priority-${task.priority}`]: !task.completed }"
        >
          <span class="task-check">{{ task.completed ? '✓' : '○' }}</span>
          <span class="task-name">{{ task.title }}</span>
          <span v-if="!task.completed" class="task-priority" :class="`priority-${task.priority}`">
            {{ task.priority === 'high' ? '!' : task.priority === 'medium' ? '•' : '' }}
          </span>
        </div>
      </div>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from './BaseWidget.vue';
import Icon from '../Icon.vue';
import { todoListStore } from '../../stores/todoList';
import { computed } from 'vue';

export default {
  name: 'TodoListWidget',
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
    const store = todoListStore;
    
    const totalTasks = computed(() => store.totalCount.value);
    const completedCount = computed(() => store.completedCount.value);
    
    const recentTasks = computed(() => {
      // Get pending tasks first (sorted by priority), then completed tasks
      const pending = [...store.pendingTasks.value];
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      pending.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      
      const completed = [...store.completedTasks.value].slice(0, 2);
      
      // Show up to 5 tasks total, prioritizing pending
      const maxPending = Math.min(pending.length, 5);
      const maxCompleted = Math.max(0, 5 - maxPending);
      
      return [...pending.slice(0, maxPending), ...completed.slice(0, maxCompleted)];
    });
    
    const handleWidgetClick = () => {
      emit('navigate', 'TodoListView');
    };
    
    return {
      store,
      totalTasks,
      completedCount,
      recentTasks,
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
.todo-list-widget {
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
  font-size: 1.1em;
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

.recent-tasks {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  overflow-y: auto;
}

.half-size .recent-tasks {
  gap: var(--spacing-xs);
}

.recent-task {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  font-size: 0.9em;
  transition: opacity 0.2s ease;
  border-left: 2px solid transparent;
  padding-left: var(--spacing-xs);
}

.recent-task.priority-high {
  border-left-color: #FF3B30;
}

.recent-task.priority-medium {
  border-left-color: #FF9500;
}

.recent-task.priority-low {
  border-left-color: #34C759;
}

.half-size .recent-task {
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
  font-size: 0.8em;
}

.recent-task.completed {
  opacity: 0.6;
}

.task-check {
  width: 20px;
  text-align: center;
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.half-size .task-check {
  width: 16px;
  font-size: 0.95em;
}

.task-name {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-task.completed .task-name {
  text-decoration: line-through;
}

.task-priority {
  font-size: 0.85em;
  font-weight: 600;
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}

.task-priority.priority-high {
  color: #FF3B30;
}

.task-priority.priority-medium {
  color: #FF9500;
}

.task-priority.priority-low {
  color: #34C759;
}

.half-size .task-priority {
  font-size: 0.75em;
  width: 12px;
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

