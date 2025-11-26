<template>
  <div class="meal-countdown-container">
    <!-- iOS-style header -->
    <header class="header">
      <h1 class="header-title">
        <span class="header-icon">🍽️</span>
        Meal Countdown
      </h1>
    </header>

    <div class="content">
      <!-- Meal Type Selection -->
      <div class="section">
        <h2 class="section-title">Meal Type</h2>
        <div class="meal-type-selector">
          <button
            class="meal-type-btn"
            :class="{ active: store.state.mealType === 'lunch' }"
            @click="store.setMealType('lunch')"
          >
            <span class="meal-icon">🍱</span>
            <span class="meal-label">Lunch</span>
          </button>
          <button
            class="meal-type-btn"
            :class="{ active: store.state.mealType === 'dinner' }"
            @click="store.setMealType('dinner')"
          >
            <span class="meal-icon">🍽️</span>
            <span class="meal-label">Dinner</span>
          </button>
        </div>
      </div>

      <!-- Time Settings -->
      <div class="section">
        <h2 class="section-title">Meal Time</h2>
        <div class="time-inputs">
          <div class="time-input-group">
            <label class="time-label">Lunch Time</label>
            <input
              type="time"
              class="time-input"
              :value="store.state.lunchTime"
              @change="handleLunchTimeChange"
            />
          </div>
          <div class="time-input-group">
            <label class="time-label">Dinner Time</label>
            <input
              type="time"
              class="time-input"
              :value="store.state.dinnerTime"
              @change="handleDinnerTimeChange"
            />
          </div>
        </div>
      </div>

      <!-- Custom Message -->
      <div class="section">
        <h2 class="section-title">Message</h2>
        <input
          type="text"
          class="message-input"
          :value="store.state.message"
          @input="handleMessageChange"
          placeholder="Enter custom message..."
        />
        <p class="message-hint">This message will be displayed before the countdown</p>
      </div>

      <!-- Countdown Display -->
      <div class="section countdown-section">
        <div class="countdown-display" :class="{ active: store.state.isActive }">
          <div class="countdown-message">{{ store.state.message }}</div>
          <div class="countdown-time">
            {{ store.formattedTimeRemaining }}
          </div>
          <div class="countdown-human">
            {{ store.humanReadableTimeRemaining }}
          </div>
        </div>
        
        <button
          class="countdown-toggle-btn"
          :class="{ active: store.state.isActive }"
          @click="store.toggleCountdown"
        >
          <span v-if="store.state.isActive">⏸️ Stop Countdown</span>
          <span v-else>▶️ Start Countdown</span>
        </button>
      </div>

      <!-- Send Message Section -->
      <div class="section send-section">
        <h2 class="section-title">Send Notification</h2>
        <button
          class="send-btn"
          @click="handleSendMessage"
          :disabled="!store.state.isActive"
        >
          📢 Send Message to All
        </button>
        <p class="send-hint" v-if="!store.state.isActive">
          Start the countdown to enable sending messages
        </p>
      </div>
    </div>

    <Nav @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import Nav from '../components/nav.vue';
import { mealCountdownStore as store } from '../stores/mealCountdown';

defineEmits(['navigate']);

const handleLunchTimeChange = (event) => {
  store.setLunchTime(event.target.value);
};

const handleDinnerTimeChange = (event) => {
  store.setDinnerTime(event.target.value);
};

const handleMessageChange = (event) => {
  store.setMessage(event.target.value);
};

const handleSendMessage = () => {
  if (!store.state.isActive) return;
  
  const message = `${store.state.message} ${store.humanReadableTimeRemaining.value}`;
  
  // Here you would integrate with your messaging system
  // For now, we'll use a simple alert/console log
  alert(`Message sent to all: "${message}"`);
  console.log('Sending message:', message);
  
  // TODO: Integrate with actual messaging API/service
};
</script>

<style scoped>
.meal-countdown-container {
  padding: var(--spacing-lg);
  padding-bottom: 180px; /* Extra space for nav and content */
  max-width: 600px;
  margin: 0 auto;
  color: white;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
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

.content {
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

.section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: rgba(255, 255, 255, 0.9);
}

/* Meal Type Selector */
.meal-type-selector {
  display: flex;
  gap: var(--spacing-md);
}

.meal-type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.meal-type-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.meal-type-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--secondary-color);
  color: white;
}

.meal-icon {
  font-size: 32px;
}

.meal-label {
  font-size: 16px;
  font-weight: 500;
}

/* Time Inputs */
.time-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.time-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.time-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.time-input {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: white;
  font-size: 16px;
  font-family: inherit;
}

.time-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  background: rgba(255, 255, 255, 0.08);
}

/* Message Input */
.message-input {
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: white;
  font-size: 16px;
  font-family: inherit;
  margin-bottom: var(--spacing-sm);
}

.message-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  background: rgba(255, 255, 255, 0.08);
}

.message-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Countdown Display */
.countdown-section {
  text-align: center;
}

.countdown-display {
  padding: var(--spacing-2xl);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.countdown-display.active {
  background: rgba(0, 120, 167, 0.2);
  border-color: var(--secondary-color);
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 120, 167, 0.3);
}

.countdown-message {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--spacing-md);
}

.countdown-time {
  font-size: 48px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: white;
  margin-bottom: var(--spacing-sm);
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
}

.countdown-human {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.countdown-toggle-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.countdown-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.countdown-toggle-btn.active {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}

/* Send Button */
.send-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  border-radius: var(--radius-md);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: rgba(0, 120, 167, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 120, 167, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: var(--spacing-sm) 0 0 0;
  text-align: center;
}

.send-section {
  margin-bottom: 0;
  padding-bottom: var(--spacing-2xl);
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .meal-countdown-container {
    padding: var(--spacing-md);
    padding-bottom: 180px; /* Keep extra space on mobile too */
  }
  
  .header-title {
    font-size: 28px;
  }
  
  .header-icon {
    font-size: 28px;
  }

  .countdown-time {
    font-size: 36px;
  }

  .meal-type-selector {
    flex-direction: column;
  }
}
</style>

