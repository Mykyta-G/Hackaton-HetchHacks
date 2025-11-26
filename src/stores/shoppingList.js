import { reactive, computed } from 'vue';

// Load initial state from localStorage or use defaults
const loadState = () => {
    const saved = localStorage.getItem('shopping-list-state');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved state:', e);
        }
    }
    return {
        items: [
            { id: 1, name: 'Milk', completed: false, category: 'Groceries' },
            { id: 2, name: 'Bread', completed: true, category: 'Groceries' },
            { id: 3, name: 'Batteries', completed: false, category: 'Household' },
        ],
        categories: ['Groceries', 'Household', 'Electronics', 'Other'],
    };
};

const state = reactive(loadState());

// Save state to localStorage and trigger custom event
const saveState = () => {
    const stateData = {
        items: state.items,
        categories: state.categories,
    };
    localStorage.setItem('shopping-list-state', JSON.stringify(stateData));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('shopping-list-update', { detail: stateData }));
};

// Listen for storage events from OTHER tabs
window.addEventListener('storage', (event) => {
    if (event.key === 'shopping-list-state' && event.newValue) {
        try {
            const newState = JSON.parse(event.newValue);
            state.items = newState.items || [];
            state.categories = newState.categories || [];
        } catch (e) {
            console.error('Failed to sync state from other tab:', e);
        }
    }
});

// Listen for custom events from THIS tab (for real-time UI updates)
window.addEventListener('shopping-list-update', (event) => {
    // Update is already in state, this is just for potential future use
});

// Poll for changes every 2 seconds as backup (catches all edge cases)
setInterval(() => {
    const saved = localStorage.getItem('shopping-list-state');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            // Only update if there are actual differences
            if (JSON.stringify(state.items) !== JSON.stringify(savedState.items) ||
                JSON.stringify(state.categories) !== JSON.stringify(savedState.categories)) {
                state.items = savedState.items;
                state.categories = savedState.categories;
            }
        } catch (e) {
            // Ignore parse errors
        }
    }
}, 2000);

const addItem = (name, category = 'Other') => {
    const newItem = {
        id: Date.now(),
        name,
        completed: false,
        category,
    };
    state.items.push(newItem);
    saveState();
};

const toggleItem = (id) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
        item.completed = !item.completed;
        saveState();
    }
};

const deleteItem = (id) => {
    state.items = state.items.filter((i) => i.id !== id);
    saveState();
};

const addCategory = (categoryName) => {
    const trimmed = categoryName.trim();
    if (trimmed && !state.categories.includes(trimmed)) {
        state.categories.push(trimmed);
        saveState();
    }
};

const itemsByCategory = computed(() => {
    const grouped = {};
    state.categories.forEach(cat => {
        grouped[cat] = state.items.filter(item => item.category === cat);
    });
    return grouped;
});

export const shoppingListStore = {
    state,
    addItem,
    toggleItem,
    deleteItem,
    addCategory,
    itemsByCategory,
};
