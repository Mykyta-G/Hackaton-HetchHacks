<template>
  <div class="todo-list-container">
    <!-- iOS-style header -->
    <header class="header">
      <h1 class="header-title">
        <Icon name="check-square" size="xl" class="header-icon" />
        Todo List
      </h1>
    </header>

    <!-- Add Task Form -->
    <div class="add-task-form">
      <div class="input-row">
        <input 
          v-model="newTaskTitle" 
          @keyup.enter="handleAddTask"
          placeholder="Add new task..." 
          class="input-field"
        />
        <button @click="handleAddTask" class="add-btn">+</button>
      </div>
      
      <div class="priority-row">
        <select v-model="selectedPriority" class="priority-select">
          <option v-for="priority in store.state.priorities" :key="priority" :value="priority">
            {{ priority.charAt(0).toUpperCase() + priority.slice(1) }} Priority
          </option>
        </select>
      </div>
    </div>

    <div class="list-content">
      <!-- Pending Tasks -->
      <div v-if="store.pendingTasks.value.length > 0" class="task-section">
        <h2 class="section-title">Pending ({{ store.pendingTasks.value.length }})</h2>
        <div class="task-list">
          <div 
            v-for="task in sortedPendingTasks" 
            :key="task.id"
            class="task-item"
            :class="{ 'priority-high': task.priority === 'high', 'priority-medium': task.priority === 'medium', 'priority-low': task.priority === 'low' }"
          >
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                :checked="task.completed" 
                @change="store.toggleTask(task.id)"
              />
              <span class="checkmark"></span>
            </label>
            <span class="task-title">{{ task.title }}</span>
            <span class="priority-badge" :class="`priority-${task.priority}`">
              {{ task.priority }}
            </span>
            <button @click="store.deleteTask(task.id)" class="delete-btn" title="Delete task">
              <span class="delete-icon">×</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Completed Tasks -->
      <div v-if="store.completedTasks.value.length > 0" class="task-section">
        <h2 class="section-title">Completed ({{ store.completedTasks.value.length }})</h2>
        <div class="task-list">
          <div 
            v-for="task in store.completedTasks.value" 
            :key="task.id"
            class="task-item completed"
          >
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                :checked="task.completed" 
                @change="store.toggleTask(task.id)"
              />
              <span class="checkmark"></span>
            </label>
            <span class="task-title">{{ task.title }}</span>
            <button @click="store.deleteTask(task.id)" class="delete-btn" title="Delete task">
              <span class="delete-icon">×</span>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="store.totalCount.value === 0" class="empty-state">
        <Icon name="file-text" size="xl" class="empty-icon" />
        <p class="empty-text">No tasks yet</p>
        <p class="empty-subtext">Add a task above to get started</p>
      </div>
    </div>
    <Nav @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Nav from '../components/nav.vue';
import Icon from '../components/Icon.vue';
import { todoListStore as store } from '../stores/todoList';

defineEmits(['navigate']);

const newTaskTitle = ref('');
const selectedPriority = ref('medium');

const sortedPendingTasks = computed(() => {
  const tasks = [...store.pendingTasks.value];
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
});

const handleAddTask = () => {
  if (newTaskTitle.value.trim()) {
    store.addTask(newTaskTitle.value.trim(), selectedPriority.value);
    newTaskTitle.value = '';
    selectedPriority.value = 'medium';
  }
};
</script>

<style scoped>
.todo-list-container {
  padding: var(--spacing-lg);
  padding-bottom: 140px; /* Space for nav */
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
  text-shadow: none;
}

.header-icon {
  font-size: 34px;
}

.add-task-form {
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

.input-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.priority-row {
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

.priority-select {
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

.priority-select option {
  background: #1a1a1a;
  color: white;
  padding: 12px;
}

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

.task-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: rgba(255, 255, 255, 0.9);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 56px;
  gap: var(--spacing-md);
}

.task-item.priority-high {
  border-left: 3px solid #FF3B30;
}

.task-item.priority-medium {
  border-left: 3px solid #FF9500;
}

.task-item.priority-low {
  border-left: 3px solid #34C759;
}

.task-item:active {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(0.98);
}

.task-item.completed {
  opacity: 0.5;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-title {
  flex: 1;
  font-size: 17px;
  line-height: 1.5;
  font-weight: 400;
  color: white;
  min-width: 0;
}

.priority-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-badge.priority-high {
  background: rgba(255, 59, 48, 0.2);
  color: #FF3B30;
}

.priority-badge.priority-medium {
  background: rgba(255, 149, 0, 0.2);
  color: #FF9500;
}

.priority-badge.priority-low {
  background: rgba(52, 199, 89, 0.2);
  color: #34C759;
}

.delete-btn {
  min-width: 44px;
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
  color: #FF3B30;
  transform: scale(1.15);
}

/* iOS-style Checkbox */
.checkbox-container {
  display: block;
  position: relative;
  min-width: 24px;
  min-height: 44px;
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
  height: 24px;
  width: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  transition: all 0.2s;
}

.checkbox-container:hover .checkmark {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.checkbox-container input:checked ~ .checkmark {
  background: #34C759;
  border-color: #34C759;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.empty-state {
  text-align: center;
  padding: 60px var(--spacing-xl);
  opacity: 0.6;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.6);
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
  .todo-list-container {
    padding: var(--spacing-md);
    padding-bottom: 140px;
  }
  
  .header-title {
    font-size: 28px;
  }
  
  .header-icon {
    font-size: 28px;
  }
}
</style>

