<template>
  <div class="activity-tracker-container">
    <!-- Modern header -->
    <header class="header">
      <div class="header-content">
        <div class="header-icon-wrapper">
          <Icon name="list" size="xl" class="header-icon" />
        </div>
        <div class="header-text">
          <h1 class="header-title">Practice Tracker</h1>
          <p class="header-subtitle">{{ store.totalCount.value }} {{ store.totalCount.value === 1 ? 'practice' : 'practices' }} • {{ store.completedCount.value }} completed</p>
        </div>
      </div>
    </header>

    <!-- Add Practice Form -->
    <div class="add-activity-form">
      <div class="input-row">
        <input 
          v-model="newActivityName" 
          @keyup.enter="handleAddActivity"
          placeholder="Practice name (e.g., Football Practice)..." 
          class="input-field"
        />
        <button @click="handleAddActivity" class="add-btn">+</button>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Child</label>
          <select v-model="selectedChild" class="form-select">
            <option v-for="child in store.state.children" :key="child" :value="child">
              {{ child }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Sport</label>
          <select v-model="selectedSport" class="form-select">
            <option v-for="sport in store.state.sports" :key="sport" :value="sport">
              {{ sport }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Duration (min)</label>
          <input
            type="number"
            min="1"
            max="480"
            v-model="selectedDuration"
            class="form-input"
            placeholder="60"
          />
        </div>
      </div>
    </div>

    <div class="list-content">
      <!-- Practices by Child -->
      <template v-for="(activities, childName) in store.activitiesByChild.value" :key="childName">
        <div v-if="activities.length > 0" class="activity-section">
          <h2 class="section-title">{{ childName }}'s Practices ({{ activities.length }})</h2>
          <div class="activity-list">
            <div 
              v-for="activity in activities" 
              :key="activity.id"
              class="activity-item"
              :class="{ 'completed': activity.completed, [`sport-${activity.sport.toLowerCase()}`]: true }"
            >
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="activity.completed" 
                  @change="store.toggleActivity(activity.id)"
                />
                <span class="checkmark"></span>
              </label>
              <div class="activity-info">
                <span class="activity-name">{{ activity.name }}</span>
                <div class="activity-meta">
                  <span class="activity-duration">{{ activity.duration }} min</span>
                  <span class="activity-sport">{{ activity.sport }}</span>
                </div>
              </div>
              <button @click="store.deleteActivity(activity.id)" class="delete-btn" title="Delete practice">
                <span class="delete-icon">×</span>
              </button>
            </div>
          </div>
        </div>
      </template>
      
      <div v-if="store.totalCount.value === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <Icon name="file-text" size="xl" class="empty-icon" />
        </div>
        <h3 class="empty-text">No practices scheduled yet</h3>
        <p class="empty-subtext">Start by adding your first practice above</p>
      </div>
    </div>
    <Nav @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Nav from '../components/nav.vue';
import Icon from '../components/Icon.vue';
import { activityTrackerStore as store } from '../stores/activityTracker';

defineEmits(['navigate']);

const newActivityName = ref('');
const selectedChild = ref(store.state.children[0] || '');
const selectedDuration = ref(60);
const selectedSport = ref(store.state.sports[0] || 'Football');

const handleAddActivity = () => {
  if (newActivityName.value.trim() && selectedChild.value) {
    store.addActivity(
      newActivityName.value.trim(),
      selectedChild.value,
      selectedDuration.value || 60,
      selectedSport.value || 'Football'
    );
    newActivityName.value = '';
    selectedDuration.value = 60;
  }
};
</script>

<style scoped>
.activity-tracker-container {
  padding: var(--spacing-lg);
  padding-bottom: 140px;
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
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.2), rgba(52, 199, 89, 0.2));
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

.add-activity-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.08);
  padding: var(--spacing-lg);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.add-activity-form:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
}

.input-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-field {
  flex: 1;
  min-width: 0;
  padding: 16px 18px;
  border: none;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.input-field:focus {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.form-select {
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.form-select:hover {
  background: rgba(255, 255, 255, 0.16);
}

.form-select:focus {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
}

.form-select option {
  background: #1a1a1a;
  color: white;
  padding: 12px;
}

.form-input {
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.add-btn {
  min-width: 56px;
  height: 56px;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #34C759, #30B350);
  color: white;
  font-size: 32px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(52, 199, 89, 0.4);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 199, 89, 0.5);
}

.add-btn:active {
  transform: translateY(0) scale(0.96);
  box-shadow: 0 2px 12px rgba(52, 199, 89, 0.4);
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

.activity-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: rgba(255, 255, 255, 0.9);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 64px;
  gap: var(--spacing-md);
  backdrop-filter: blur(10px);
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
}

.activity-item.sport-football {
  border-left: 4px solid #007AFF;
  background: rgba(0, 122, 255, 0.05);
}

.activity-item.sport-badminton {
  border-left: 4px solid #34C759;
  background: rgba(52, 199, 89, 0.05);
}

.activity-item.sport-swimming {
  border-left: 4px solid #00D4FF;
  background: rgba(0, 212, 255, 0.05);
}

.activity-item.sport-basketball {
  border-left: 4px solid #FF9500;
  background: rgba(255, 149, 0, 0.05);
}

.activity-item.sport-tennis {
  border-left: 4px solid #FF2D55;
  background: rgba(255, 45, 85, 0.05);
}

.activity-item.sport-soccer {
  border-left: 4px solid #007AFF;
  background: rgba(0, 122, 255, 0.05);
}

.activity-item.sport-volleyball {
  border-left: 4px solid #AF52DE;
  background: rgba(175, 82, 222, 0.05);
}

.activity-item.sport-other {
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.activity-item:active {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(2px) scale(0.99);
}

.activity-item.completed {
  opacity: 0.5;
}

.activity-item.completed .activity-name {
  text-decoration: line-through;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.activity-name {
  font-size: 17px;
  line-height: 1.5;
  font-weight: 500;
  color: white;
}

.activity-meta {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  font-size: 13px;
}

.activity-duration {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.activity-sport {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
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
  .activity-tracker-container {
    padding: var(--spacing-md);
    padding-bottom: 140px;
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

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

