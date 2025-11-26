<template>
  <div class="add-item-form">
    <!-- Row 1: Input + Add Button -->
    <div class="input-row">
      <input 
        v-model="newItemName" 
        @keyup.enter="submitItem"
        placeholder="Add new item..." 
        class="input-field"
      />
      <button @click="submitItem" class="add-btn">+</button>
    </div>
    
    <!-- Row 2: Category Select + Add Category -->
    <div class="category-row">
      <select v-model="selectedCategory" class="category-select">
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <button @click="showNewCategory = !showNewCategory" class="add-category-toggle" title="Add new category">
        <span class="icon">+</span>
        <span class="text">Category</span>
      </button>
    </div>
  </div>
  
  <!-- New Category Input -->
  <div v-if="showNewCategory" class="new-category-form">
    <input 
      v-model="newCategoryName" 
      @keyup.enter="submitNewCategory"
      placeholder="New category name..." 
      class="input-field"
    />
    <div class="button-row">
      <button @click="submitNewCategory" class="add-category-btn">Add</button>
      <button @click="showNewCategory = false" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add-item', 'add-category']);

const newItemName = ref('');
const selectedCategory = ref(props.categories[0] || 'Other');
const showNewCategory = ref(false);
const newCategoryName = ref('');

const submitItem = () => {
  if (newItemName.value.trim()) {
    emit('add-item', { name: newItemName.value, category: selectedCategory.value });
    newItemName.value = '';
  }
};

const submitNewCategory = () => {
  if (newCategoryName.value.trim()) {
    emit('add-category', newCategoryName.value);
    selectedCategory.value = newCategoryName.value;
    newCategoryName.value = '';
    showNewCategory.value = false;
  }
};
</script>

<style scoped>
.add-item-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.12);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Row 1: Input + Green Button */
.input-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* Row 2: Category Select + Add Category Button */
.category-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.input-field {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: all 0.2s;
}

.input-field:focus {
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.category-select {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
}

.category-select option {
  background: #1a1a1a;
  color: white;
  padding: 12px;
}

/* Green Add Button */
.add-btn {
  min-width: 56px;
  height: 44px;
  padding: 0 20px;
  border: none;
  border-radius: var(--radius-md);
  background: #34C759;
  color: white;
  font-size: 28px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
  flex-shrink: 0;
}

.add-btn:active {
  transform: scale(0.95);
  background: #30B350;
}

/* Add Category Toggle Button - Text Style */
.add-category-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.add-category-toggle:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.25);
}

.add-category-toggle .icon {
  font-size: 18px;
  font-weight: 700;
}

.add-category-toggle .text {
  font-size: 14px;
}

.new-category-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.button-row {
  display: flex;
  gap: var(--spacing-sm);
}

.add-category-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: var(--radius-md);
  background: #007AFF;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-category-btn:active {
  transform: scale(0.98);
  background: #0051D5;
}

.cancel-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.25);
}
</style>
