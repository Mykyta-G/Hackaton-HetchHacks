import { reactive, computed } from 'vue';

const state = reactive({
  mealType: 'lunch', // 'lunch' or 'dinner'
  lunchTime: '12:00', // Default lunch time (12:00 PM)
  dinnerTime: '18:00', // Default dinner time (6:00 PM)
  message: 'Lunch will be served in', // Default message
  isActive: false, // Whether countdown is active
  targetTime: null, // Target time for countdown
  currentTimestamp: Date.now(), // Reactive timestamp that updates every second
});

// Computed values
const currentTargetTime = computed(() => {
  if (!state.isActive || !state.targetTime) return null;
  
  const now = new Date();
  const target = new Date(state.targetTime);
  
  // If target time has passed, return null
  if (target <= now) {
    return null;
  }
  
  return target;
});

const timeRemaining = computed(() => {
  const target = currentTargetTime.value;
  if (!target) return null;
  
  // Use reactive timestamp to trigger updates
  const now = new Date(state.currentTimestamp);
  const diff = target - now;
  
  if (diff <= 0) return null;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    hours,
    minutes,
    seconds,
    totalMinutes: Math.floor(diff / (1000 * 60)),
    totalSeconds: Math.floor(diff / 1000)
  };
});

const formattedTimeRemaining = computed(() => {
  const time = timeRemaining.value;
  if (!time) return '00:00:00';
  
  const formatNumber = (num) => String(num).padStart(2, '0');
  
  if (time.hours > 0) {
    return `${formatNumber(time.hours)}:${formatNumber(time.minutes)}:${formatNumber(time.seconds)}`;
  } else {
    return `${formatNumber(time.minutes)}:${formatNumber(time.seconds)}`;
  }
});

const humanReadableTimeRemaining = computed(() => {
  const time = timeRemaining.value;
  if (!time) return 'Time\'s up!';
  
  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m`;
  } else if (time.minutes > 0) {
    return `${time.minutes}m ${time.seconds}s`;
  } else {
    return `${time.seconds}s`;
  }
});

// Methods
const setMealType = (type) => {
  state.mealType = type;
  updateMessage();
};

const setLunchTime = (time) => {
  state.lunchTime = time;
  if (state.isActive && state.mealType === 'lunch') {
    startCountdown();
  }
};

const setDinnerTime = (time) => {
  state.dinnerTime = time;
  if (state.isActive && state.mealType === 'dinner') {
    startCountdown();
  }
};

const setMessage = (message) => {
  state.message = message;
};

const updateMessage = () => {
  if (state.mealType === 'lunch') {
    state.message = 'Lunch will be served in';
  } else {
    state.message = 'Dinner will be served in';
  }
};

const startCountdown = () => {
  const timeString = state.mealType === 'lunch' ? state.lunchTime : state.dinnerTime;
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  // If target time has passed today, set it for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  state.targetTime = target.toISOString();
  state.isActive = true;
  updateMessage();
};

const stopCountdown = () => {
  state.isActive = false;
  state.targetTime = null;
};

const toggleCountdown = () => {
  if (state.isActive) {
    stopCountdown();
  } else {
    startCountdown();
  }
};

// Start interval to update timestamp every second
let intervalId = null;

const startTimer = () => {
  if (intervalId) return; // Already running
  
  intervalId = setInterval(() => {
    state.currentTimestamp = Date.now();
  }, 1000);
};

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// Start timer when module loads
startTimer();

export const mealCountdownStore = {
  state,
  currentTargetTime,
  timeRemaining,
  formattedTimeRemaining,
  humanReadableTimeRemaining,
  setMealType,
  setLunchTime,
  setDinnerTime,
  setMessage,
  startCountdown,
  stopCountdown,
  toggleCountdown,
};

