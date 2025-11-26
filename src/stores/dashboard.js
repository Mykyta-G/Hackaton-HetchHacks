import { reactive } from 'vue';

const state = reactive({
  widgets: []
});

let nextWidgetId = 1;

const addWidget = (type, config = {}) => {
  const widget = {
    id: nextWidgetId++,
    type: type,
    size: config.size || 'full',
    ...config
  };
  state.widgets.push(widget);
  return widget;
};

const removeWidget = (id) => {
  const index = state.widgets.findIndex(w => w.id === id);
  if (index !== -1) {
    state.widgets.splice(index, 1);
  }
};

const updateWidget = (id, updates) => {
  const widget = state.widgets.find(w => w.id === id);
  if (widget) {
    Object.assign(widget, updates);
  }
};

const reorderWidgets = (newOrder) => {
  state.widgets = newOrder;
};

export const dashboardStore = {
  state,
  addWidget,
  removeWidget,
  updateWidget,
  reorderWidgets
};

