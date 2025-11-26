<template>
  <div class="category-group">
    <h3 class="category-title">
      <span class="category-emoji">📦</span>
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
  margin-bottom: 24px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.category-title {
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  padding-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
}

.category-emoji {
  font-size: 1.2em;
}

.item-count {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
