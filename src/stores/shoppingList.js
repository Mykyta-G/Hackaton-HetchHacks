import { reactive, computed } from 'vue';

const state = reactive({
    items: [
        { id: 1, name: 'Milk', completed: false, category: 'Groceries' },
        { id: 2, name: 'Bread', completed: true, category: 'Groceries' },
        { id: 3, name: 'Batteries', completed: false, category: 'Household' },
    ],
    categories: ['Groceries', 'Household', 'Electronics', 'Other'],
});

const addItem = (name, category = 'Other') => {
    state.items.push({
        id: Date.now(),
        name,
        completed: false,
        category,
    });
};

const toggleItem = (id) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
        item.completed = !item.completed;
    }
};

const deleteItem = (id) => {
    state.items = state.items.filter((i) => i.id !== id);
};

const addCategory = (categoryName) => {
    const trimmed = categoryName.trim();
    if (trimmed && !state.categories.includes(trimmed)) {
        state.categories.push(trimmed);
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
