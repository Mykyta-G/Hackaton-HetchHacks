<template>
  <div class="shopping-list-container">
    <!-- Modern header -->
    <header class="header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <Icon name="shopping-cart" size="xl" class="header-icon" />
        </div>
        <div class="header-text">
          <h1 class="header-title">Shopping List</h1>
          <p class="header-subtitle">{{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}</p>
        </div>
      </div>
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
        <div class="empty-icon-wrapper">
          <Icon name="file-text" size="xl" class="empty-icon" />
        </div>
        <h3 class="empty-text">Your list is empty</h3>
        <p class="empty-subtext">Start adding items to your shopping list</p>
      </div>
    </div>
    <Nav @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Nav from '../components/nav.vue';
import Icon from '../components/Icon.vue';
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
  padding-bottom: 120px;
  max-width: 640px;
  margin: 0 auto;
  color: white;
  min-height: 100vh;
}

/* Modern header */
.header {
  margin-bottom: var(--spacing-xl);
  padding-top: var(--spacing-md);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.2), rgba(0, 122, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.header-icon {
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.95);
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.8px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: -0.2px;
}

.list-content {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: 80px var(--spacing-xl);
  animation: fadeIn 0.5s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.empty-icon {
  width: 40px;
  height: 40px;
  opacity: 0.4;
  color: rgba(255, 255, 255, 0.5);
}

.empty-text {
  font-size: 22px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: -0.3px;
}

.empty-subtext {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .shopping-list-container {
    padding: var(--spacing-md);
    padding-bottom: 120px;
  }
  
  .header-title {
    font-size: 28px;
  }
  
  .header-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .header-icon {
    width: 24px;
    height: 24px;
  }
  
  .header-subtitle {
    font-size: 14px;
  }
}
</style>
