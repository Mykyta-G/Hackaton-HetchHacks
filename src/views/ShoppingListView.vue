<template>
  <div class="shopping-list-container">
    <!-- iOS-style header -->
    <header class="header">
      <h1 class="header-title">
        <span class="header-icon">🛒</span>
        Shopping List
      </h1>
    </header>

    <ShoppingListInput 
      :categories="store.state.categories"
      @add-item="handleAddItem"
      @add-category="handleAddCategory"
    />

    <div class="list-content">
      <template v-for="(items, category) in store.itemsByCategory.value" :key="category">
        <ShoppingListGroup 
          v-if="items.length > 0"
          :title="category"
          :items="items"
          @toggle="store.toggleItem"
          @delete="store.deleteItem"
        />
      </template>
      
      <div v-if="totalItems === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p class="empty-text">No items yet</p>
        <p class="empty-subtext">Tap the + button to add your first item</p>
      </div>
    </div>
    <Nav @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Nav from '../components/nav.vue';
import { shoppingListStore as store } from '../stores/shoppingList';
import ShoppingListInput from '../components/ShoppingList/ShoppingListInput.vue';
import ShoppingListGroup from '../components/ShoppingList/ShoppingListGroup.vue';

defineEmits(['navigate']);

const handleAddItem = ({ name, category }) => {
  store.addItem(name, category);
};

const handleAddCategory = (categoryName) => {
  store.addCategory(categoryName);
};

const totalItems = computed(() => store.state.items.length);
</script>

<style scoped>
.shopping-list-container {
  padding: var(--spacing-lg);
  padding-bottom: 100px; /* Space for nav */
  max-width: 600px;
  margin: 0 auto;
  color: white;
}

/* iOS-style header */
.header {
  margin-bottom: var(--spacing-2xl);
  padding-top: var(--spacing-md);
}

.header-title {
  margin: 0;
  font-size: 34px; /* iOS large title size */
  font-weight: 700;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-shadow: none; /* Remove shadow for cleaner iOS look */
}

.header-icon {
  font-size: 34px;
}

.list-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: 60px var(--spacing-xl);
  opacity: 0.6;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-text {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-subtext {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 400;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .shopping-list-container {
    padding: var(--spacing-md);
  }
  
  .header-title {
    font-size: 28px;
  }
  
  .header-icon {
    font-size: 28px;
  }
}
</style>
