<template>
  <div class="nav">
    <h1>Nav Component</h1>
  </div>
</template>

<script>
export default {
  name: 'Nav',
};
</script>

<style scoped>
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--secondary-color);
  padding: 10px;
  border-radius: 5px 5px 0 0;
  z-index: 1000;
}
</style>