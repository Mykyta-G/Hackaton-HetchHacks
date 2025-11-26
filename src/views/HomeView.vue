<template>
  <div class="home">
    <header class="dashboard-header">
      <h1 class="header-title">Dashboard</h1>
    </header>
    
    <div class="dashboard-container">
      <div 
        class="dashboard-grid"
        @dragover.prevent="handleGridDragOver"
        @drop.prevent="handleGridDrop"
      >
        <component
          v-for="widget in widgets"
          :key="widget.id"
          :is="getWidgetComponent(widget.type)"
          :widget-id="widget.id"
          :size="widget.size"
          v-bind="getWidgetProps(widget)"
          @drag-start="handleWidgetDragStart"
          @drop="handleWidgetDrop"
          @resize="handleWidgetResize"
          @navigate="handleWidgetNavigate"
          @delete="handleWidgetDelete"
        />
      </div>
    </div>
    
    <AddWidgetButton @add-widget="handleAddWidget" />
    <Nav :currentView="currentView" @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script>
import Nav from '../components/nav.vue';
import AddWidgetButton from '../components/widgets/AddWidgetButton.vue';
import PlaceholderWidget from '../components/widgets/PlaceholderWidget.vue';
import ShoppingListWidget from '../components/widgets/ShoppingListWidget.vue';
import MealCountdownWidget from '../components/widgets/MealCountdownWidget.vue';
import TodoListWidget from '../components/widgets/TodoListWidget.vue';
import { dashboardStore } from '../stores/dashboard';

// Widget type registry
const widgetRegistry = {
  'placeholder': PlaceholderWidget,
  'shopping-list': ShoppingListWidget,
  'meal-countdown': MealCountdownWidget,
  'todo-list': TodoListWidget
};

export default {
  name: 'HomeView',
  components: {
    Nav,
    AddWidgetButton,
    PlaceholderWidget,
    ShoppingListWidget,
    MealCountdownWidget,
    TodoListWidget,
  },
  props: {
    currentView: {
      type: String,
      default: 'HomeView'
    }
  },
  emits: ['navigate'],
  computed: {
    widgets() {
      return dashboardStore.state.widgets;
    }
  },
  data() {
    return {
      draggedWidgetId: null,
    };
  },
  methods: {
    getWidgetComponent(type) {
      return widgetRegistry[type] || PlaceholderWidget;
    },
    getWidgetProps(widget) {
      // Return props specific to widget type
      if (widget.type === 'placeholder') {
        return {
          title: widget.title || 'Widget',
          content: widget.content || 'This is a placeholder widget.'
        };
      }
      return {};
    },
    handleAddWidget(type) {
      const config = {};
      if (type === 'placeholder') {
        config.title = `Widget ${dashboardStore.state.widgets.length + 1}`;
        config.content = 'Drag me to rearrange!';
      }
      dashboardStore.addWidget(type, config);
      this.$nextTick(() => {
        this.optimizeLayout();
      });
    },
    handleWidgetNavigate(view) {
      this.$emit('navigate', view);
    },
    handleWidgetDragStart({ widgetId }) {
      this.draggedWidgetId = widgetId;
    },
    handleWidgetDrop({ draggedWidgetId, targetWidgetId, isCenter, isLeft, isRight, isTop, isBottom }) {
      if (!draggedWidgetId || !targetWidgetId) return;
      
      const widgets = [...this.widgets]; // Create a copy to work with
      const draggedIndex = widgets.findIndex(w => w.id.toString() === draggedWidgetId.toString());
      const targetIndex = widgets.findIndex(w => w.id.toString() === targetWidgetId.toString());
      
      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        this.draggedWidgetId = null;
        return;
      }
      
      const draggedWidget = widgets[draggedIndex];
      const targetWidget = widgets[targetIndex];
      
      // Remove dragged widget first to avoid index issues
      const [draggedWidgetData] = widgets.splice(draggedIndex, 1);
      
      // Recalculate target index after removal
      let newTargetIndex = widgets.findIndex(w => w.id.toString() === targetWidgetId.toString());
      
      // Handle different drop positions
      if (isCenter) {
        // Center drop: swap positions preserving sizes
        widgets.splice(newTargetIndex, 0, draggedWidgetData);
      } else if (isTop) {
        // Drop above: place widget before target
        widgets.splice(newTargetIndex, 0, draggedWidgetData);
      } else if (isBottom) {
        // Drop below: place widget after target
        widgets.splice(newTargetIndex + 1, 0, draggedWidgetData);
      } else if (isLeft || isRight) {
        // Side drop: use smart resizing logic
        // Case 1: Dragging half widget beside full widget -> shrink full widget to half
        if (draggedWidgetData.size === 'half' && targetWidget.size === 'full') {
          dashboardStore.updateWidget(targetWidget.id, { size: 'half' });
          widgets.splice(newTargetIndex + 1, 0, draggedWidgetData);
        }
        // Case 2: Dragging full widget beside full widget -> shrink both to half
        else if (draggedWidgetData.size === 'full' && targetWidget.size === 'full') {
          dashboardStore.updateWidget(draggedWidgetData.id, { size: 'half' });
          dashboardStore.updateWidget(targetWidget.id, { size: 'half' });
          widgets.splice(newTargetIndex + 1, 0, draggedWidgetData);
        }
        // Case 3: Dragging full widget beside half widget -> shrink dragged widget to half
        else if (draggedWidgetData.size === 'full' && targetWidget.size === 'half') {
          dashboardStore.updateWidget(draggedWidgetData.id, { size: 'half' });
          widgets.splice(newTargetIndex + 1, 0, draggedWidgetData);
        }
        // Case 4: Both half widgets - place beside
        else {
          widgets.splice(newTargetIndex + 1, 0, draggedWidgetData);
        }
      } else {
        // Default: place after target
        widgets.splice(newTargetIndex + 1, 0, draggedWidgetData);
      }
      
      this.draggedWidgetId = null;
      // Update store with new order
      dashboardStore.reorderWidgets(widgets);
      this.$nextTick(() => {
        this.optimizeLayout();
      });
    },
    handleGridDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    handleGridDrop(event) {
      // Handle drop on empty grid space if needed
      this.draggedWidgetId = null;
    },
    handleWidgetResize({ widgetId, newSize }) {
      dashboardStore.updateWidget(widgetId, { size: newSize });
      const widget = this.widgets.find(w => w.id.toString() === widgetId.toString());
      if (widget) {
        const oldSize = widget.size;
        
        // If widget was shrunk from full to half, try to optimize layout
        if (oldSize === 'full' && newSize === 'half') {
          this.$nextTick(() => {
            this.optimizeLayoutAfterShrink(widgetId);
          });
        } else {
          this.$nextTick(() => {
            this.optimizeLayout();
          });
        }
      }
    },
    handleWidgetDelete({ widgetId }) {
      dashboardStore.removeWidget(widgetId);
      this.$nextTick(() => {
        this.optimizeLayout();
      });
    },
    optimizeLayoutAfterShrink(shrunkenWidgetId) {
      // When a widget shrinks from full to half, try to find a half widget below
      // that's alone and can move up to pair with it
      const widgets = [...this.widgets]; // Create a copy to work with
      const shrunkenIndex = widgets.findIndex(w => w.id.toString() === shrunkenWidgetId.toString());
      if (shrunkenIndex === -1) return;
      
      // Simulate layout to find widgets that could move up
      let currentRowColumns = 0;
      let foundShrunken = false;
      
      for (let i = 0; i < widgets.length; i++) {
        const widget = widgets[i];
        
        if (widget.id.toString() === shrunkenWidgetId.toString()) {
          foundShrunken = true;
          currentRowColumns = 1; // Now it's half-width
          continue;
        }
        
        if (widget.size === 'full') {
          currentRowColumns = 0;
        } else {
          currentRowColumns += 1;
          
          // If we found the shrunken widget and now see a half widget alone
          if (foundShrunken && currentRowColumns === 1) {
            // Check if this widget is alone (next widget is full or doesn't exist)
            const nextWidget = i < widgets.length - 1 ? widgets[i + 1] : null;
            if (!nextWidget || nextWidget.size === 'full') {
              // This widget is alone, move it up to pair with shrunken widget
              const [widgetToMove] = widgets.splice(i, 1);
              widgets.splice(shrunkenIndex + 1, 0, widgetToMove);
              // Update store with new order
              dashboardStore.reorderWidgets(widgets);
              break; // Only move one at a time
            }
          }
          
          if (currentRowColumns >= 2) {
            currentRowColumns = 0;
          }
        }
      }
      
      // Run general optimization
      this.optimizeLayout();
    },
    optimizeLayout() {
      // Smart layout optimization inspired by Apple's widget system
      // Only fix truly problematic stray widgets (last widget alone with no way to pair)
      // Allow natural flow otherwise
      
      if (this.widgets.length === 0) return;
      
      // Check if last widget is alone and there's no way to pair it
      let currentRowColumns = 0;
      let lastHalfWidgetIndex = -1;
      
      for (let i = 0; i < this.widgets.length; i++) {
        const widget = this.widgets[i];
        
        if (widget.size === 'full') {
          currentRowColumns = 0;
          lastHalfWidgetIndex = -1;
        } else {
          currentRowColumns += 1;
          
          if (currentRowColumns === 1) {
            lastHalfWidgetIndex = i;
          } else if (currentRowColumns >= 2) {
            currentRowColumns = 0;
            lastHalfWidgetIndex = -1;
          }
        }
      }
      
      // Only fix if last widget is truly alone with no possibility of pairing
      // (i.e., it's the last widget AND it's alone in its row)
      if (lastHalfWidgetIndex === this.widgets.length - 1 && currentRowColumns === 1) {
        // Check if there are any full-width widgets before it that could be shrunk
        // If not, convert to full-width as last resort
        const lastWidget = this.widgets[lastHalfWidgetIndex];
        let canPair = false;
        
        // Look backwards for opportunities to pair
        for (let i = lastHalfWidgetIndex - 1; i >= 0; i--) {
          const widget = this.widgets[i];
          if (widget.size === 'full') {
            break; // Hit a full widget, can't pair backwards
          }
          if (widget.size === 'half') {
            canPair = true;
            break; // Found a half widget that could pair
          }
        }
        
        // Only convert to full if truly no way to pair
        if (!canPair) {
          dashboardStore.updateWidget(lastWidget.id, { size: 'full' });
        }
      }
    },
  },
  mounted() {
    // Optimize layout on initial load
    this.$nextTick(() => {
      this.optimizeLayout();
    });
  },
};
</script>

<style scoped>
.home {
  padding: var(--spacing-lg);
  padding-bottom: 100px; /* Space for fixed nav */
  min-height: 100vh;
  color: white;
  max-width: 100%;
  overflow-x: hidden;
}

.dashboard-header {
  margin-bottom: var(--spacing-2xl);
  padding-top: var(--spacing-md);
}

.header-title {
  margin: 0;
  font-size: 2em;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
}

.dashboard-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  overflow: visible;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: row dense; /* Dense packing - fill gaps automatically */
  gap: var(--spacing-lg);
  width: 100%;
  padding: 0;
  padding-bottom: 20px; /* Extra padding for bottom widgets */
  align-items: start; /* Align widgets to top */
  position: relative;
  z-index: 1;
}

/* Responsive: single column on very small screens */
@media (max-width: 400px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  /* On single column, all widgets are full width */
  .dashboard-grid > * {
    grid-column: span 1 !important;
}
}

/* Ensure widgets don't overflow */
.dashboard-grid > * {
  min-width: 0;
  width: 100%;
}
</style>
