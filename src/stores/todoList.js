import { reactive, computed } from 'vue';

const state = reactive({
    tasks: [
        { id: 1, title: 'Complete project documentation', completed: false, priority: 'high', dueDate: null },
        { id: 2, title: 'Review code changes', completed: true, priority: 'medium', dueDate: null },
        { id: 3, title: 'Schedule team meeting', completed: false, priority: 'low', dueDate: null },
    ],
    priorities: ['high', 'medium', 'low'],
});

const addTask = (title, priority = 'medium', dueDate = null) => {
    state.tasks.push({
        id: Date.now(),
        title,
        completed: false,
        priority,
        dueDate,
    });
};

const toggleTask = (id) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
    }
};

const deleteTask = (id) => {
    const index = state.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
        state.tasks.splice(index, 1);
    }
};

const updateTask = (id, updates) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
        Object.assign(task, updates);
    }
};

const completedCount = computed(() => 
    state.tasks.filter(task => task.completed).length
);

const totalCount = computed(() => state.tasks.length);

const pendingTasks = computed(() => 
    state.tasks.filter(task => !task.completed)
);

const completedTasks = computed(() => 
    state.tasks.filter(task => task.completed)
);

const tasksByPriority = computed(() => {
    const grouped = {
        high: state.tasks.filter(task => task.priority === 'high' && !task.completed),
        medium: state.tasks.filter(task => task.priority === 'medium' && !task.completed),
        low: state.tasks.filter(task => task.priority === 'low' && !task.completed),
    };
    return grouped;
});

export const todoListStore = {
    state,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    completedCount,
    totalCount,
    pendingTasks,
    completedTasks,
    tasksByPriority,
};

