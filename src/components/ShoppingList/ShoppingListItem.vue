<template>
  <li class="item-row" :class="{ completed: item.completed }">
    <label class="checkbox-container">
      <input 
        type="checkbox" 
        :checked="item.completed" 
        @change="$emit('toggle', item.id)"
      />
      <span class="checkmark"></span>
    </label>
    <span class="item-name">{{ item.name }}</span>
    <button @click="$emit('delete', item.id)" class="delete-btn" title="Delete item">
      <span class="delete-icon">×</span>
    </button>
  </li>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['toggle', 'delete']);
</script>

<style scoped>
.item-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 56px; /* iOS touch target */
}

.item-row:active {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(0.98);
}

.item-row.completed {
  opacity: 0.5;
}

.item-row.completed .item-name {
  text-decoration: line-through;
}

.item-name {
  flex: 1;
  margin-left: 14px;
  font-size: 17px; /* iOS system font size */
  line-height: 1.5;
  font-weight: 400;
  color: white;
}

.delete-btn {
  min-width: 44px; /* iOS touch target */
  min-height: 44px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.delete-icon {
  font-size: 32px;
  line-height: 1;
}

.delete-btn:active {
  color: #FF3B30; /* iOS red */
  transform: scale(1.15);
}

/* iOS-style Checkbox */
.checkbox-container {
  display: block;
  position: relative;
  min-width: 24px;
  min-height: 44px; /* iOS touch target */
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 24px;
  width: 24px;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 50%; /* iOS circular checkboxes */
  transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #34C759; /* iOS green */
  border-color: #34C759;
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.4);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
}
</style>
