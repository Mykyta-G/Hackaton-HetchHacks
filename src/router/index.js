import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ShoppingListView from '../views/ShoppingListView.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/shopping-list',
        name: 'ShoppingList',
        component: ShoppingListView,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
