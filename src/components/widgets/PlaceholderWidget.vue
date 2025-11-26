<template>
  <BaseWidget 
    :widget-id="widgetId" 
    :size="size"
    @resize="handleResize"
  >
    <div class="placeholder-widget">
      <div class="widget-header">
        <h3 class="widget-title">{{ title }}</h3>
      </div>
      <p class="widget-content-text">{{ content }}</p>
    </div>
  </BaseWidget>
</template>

<script>
import BaseWidget from './BaseWidget.vue';

export default {
  name: 'PlaceholderWidget',
  components: {
    BaseWidget
  },
  props: {
    widgetId: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      default: 'Widget'
    },
    content: {
      type: String,
      default: 'This is a placeholder widget. Drag me to rearrange!'
    },
    size: {
      type: String,
      default: 'full',
      validator: (value) => ['half', 'full'].includes(value)
    }
  },
  emits: ['resize'],
  methods: {
    handleResize({ widgetId, newSize }) {
      this.$emit('resize', { widgetId, newSize });
    }
  }
};
</script>

<style scoped>
.placeholder-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
}

.widget-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.widget-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  flex: 1;
}

.widget-content-text {
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
}
</style>

