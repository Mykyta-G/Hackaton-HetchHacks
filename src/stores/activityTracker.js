import { reactive, computed } from 'vue';

const state = reactive({
    activities: [
        { id: 1, name: 'Football Practice', childName: 'Emma', duration: 60, completed: false, sport: 'Football' },
        { id: 2, name: 'Badminton Practice', childName: 'Emma', duration: 45, completed: true, sport: 'Badminton' },
        { id: 3, name: 'Football Practice', childName: 'Lucas', duration: 90, completed: false, sport: 'Football' },
        { id: 4, name: 'Swimming Practice', childName: 'Lucas', duration: 30, completed: false, sport: 'Swimming' },
    ],
    sports: ['Football', 'Badminton', 'Swimming', 'Basketball', 'Tennis', 'Soccer', 'Volleyball', 'Other'],
    children: ['Emma', 'Lucas'],
});

const addActivity = (name, childName, duration, sport = 'Other') => {
    state.activities.push({
        id: Date.now(),
        name,
        childName,
        duration, // duration in minutes
        completed: false,
        sport,
    });
};

const toggleActivity = (id) => {
    const activity = state.activities.find((a) => a.id === id);
    if (activity) {
        activity.completed = !activity.completed;
    }
};

const deleteActivity = (id) => {
    const index = state.activities.findIndex((a) => a.id === id);
    if (index !== -1) {
        state.activities.splice(index, 1);
    }
};

const updateActivity = (id, updates) => {
    const activity = state.activities.find((a) => a.id === id);
    if (activity) {
        Object.assign(activity, updates);
    }
};

const addSport = (sportName) => {
    const trimmed = sportName.trim();
    if (trimmed && !state.sports.includes(trimmed)) {
        state.sports.push(trimmed);
    }
};

const addChild = (childName) => {
    const trimmed = childName.trim();
    if (trimmed && !state.children.includes(trimmed)) {
        state.children.push(trimmed);
    }
};

const completedCount = computed(() => 
    state.activities.filter(activity => activity.completed).length
);

const totalCount = computed(() => state.activities.length);

const pendingActivities = computed(() => 
    state.activities.filter(activity => !activity.completed)
);

const completedActivities = computed(() => 
    state.activities.filter(activity => activity.completed)
);

const activitiesByChild = computed(() => {
    const grouped = {};
    state.children.forEach(child => {
        grouped[child] = state.activities.filter(activity => activity.childName === child);
    });
    return grouped;
});

const activitiesBySport = computed(() => {
    const grouped = {};
    state.sports.forEach(sport => {
        grouped[sport] = state.activities.filter(activity => activity.sport === sport);
    });
    return grouped;
});

export const activityTrackerStore = {
    state,
    addActivity,
    toggleActivity,
    deleteActivity,
    updateActivity,
    addSport,
    addChild,
    completedCount,
    totalCount,
    pendingActivities,
    completedActivities,
    activitiesByChild,
    activitiesBySport,
};

