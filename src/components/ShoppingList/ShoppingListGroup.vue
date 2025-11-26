<template>
  <div class="category-group">
    <h3 class="category-title">
      <Icon name="box" size="sm" class="category-icon" />
      {{ title }}
      <span class="item-count">{{ items.length }}</span>
    </h3>
    <ul class="items-list">
      <ShoppingListItem 
        v-for="item in items" 
        :key="item.id" 
        :item="item"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
      />
    </ul>
  </div>
</template>

<script setup>
import Icon from '../Icon.vue';
import ShoppingListItem from './ShoppingListItem.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle', 'delete']);
</script>

<style scoped>
.category-group {
  margin-bottom: var(--spacing-xl);
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-icon {
  flex-shrink: 0;
  opacity: 0.6;
}

.item-count {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.12);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
