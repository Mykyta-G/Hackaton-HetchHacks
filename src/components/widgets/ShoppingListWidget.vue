<template>
  <BaseWidget 
    :widget-id="widgetId" 
    :size="size"
    @resize="handleResize"
    @click="handleWidgetClick"
  >
    <div class="shopping-list-widget" :class="{ 'half-size': size === 'half' }" @click.stop="handleWidgetClick">
      <div class="widget-header">
        <h3 class="widget-title">
          <span class="widget-icon">🛒</span>
          Shopping List
        </h3>
        <div class="widget-stats">
          <span class="stat-item">{{ totalItems }} items</span>
          <span class="stat-item">{{ completedCount }} done</span>
        </div>
      </div>
      
      <div class="recent-items">
        <div 
          v-if="recentItems.length === 0" 
          class="empty-state"
        >
          <p class="empty-text">No items yet</p>
          <p class="empty-hint">Tap to add items</p>
        </div>
        <div 
          v-for="item in recentItems" 
          :key="item.id"
          class="recent-item"
          :class="{ 'completed': item.completed }"
        >
          <span class="item-check">{{ item.completed ? '✓' : '○' }}</span>
          <span class="item-name">{{ item.name }}</span>
          <span class="item-category">{{ item.category }}</span>
        </div>
      </div>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from './BaseWidget.vue';
import { shoppingListStore } from '../../stores/shoppingList';
import { computed } from 'vue';

export default {
  name: 'ShoppingListWidget',
  components: {
    BaseWidget
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
    const store = shoppingListStore;
    
    const totalItems = computed(() => store.state.items.length);
    const completedCount = computed(() => 
      store.state.items.filter(item => item.completed).length
    );
    const recentItems = computed(() => {
      // Get last 5 items, most recent first
      return [...store.state.items].reverse().slice(0, 5);
    });
    
    const handleWidgetClick = () => {
      emit('navigate', 'ShoppingListView');
    };
    
    return {
      store,
      totalItems,
      completedCount,
      recentItems,
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
.shopping-list-widget {
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

.recent-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  overflow-y: auto;
}

.half-size .recent-items {
  gap: var(--spacing-xs);
}

.recent-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
  font-size: 0.9em;
  transition: opacity 0.2s ease;
}

.half-size .recent-item {
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
  font-size: 0.8em;
}

.recent-item.completed {
  opacity: 0.6;
}

.item-check {
  width: 20px;
  text-align: center;
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.half-size .item-check {
  width: 16px;
  font-size: 0.95em;
}

.item-name {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-item.completed .item-name {
  text-decoration: line-through;
}

.item-category {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.half-size .item-category {
  font-size: 0.7em;
  padding: 1px 6px;
  border-radius: 6px;
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

