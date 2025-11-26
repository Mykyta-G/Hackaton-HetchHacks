<template>
  <div class="home">
    <h2>Home</h2>
    <button @click="$router.push('/shopping-list')" class="nav-btn">
      Go to Shopping List
    </button>
    <Nav />
  </div>
</template>

<script>
import Nav from '../components/nav.vue';

export default {
  name: 'HomeView',
  components: {
    Nav,
  },
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.nav-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #45a049;
}
</style>
