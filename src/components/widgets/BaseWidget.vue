<template>
  <div
    class="base-widget"
    :class="{ 
      'dragging': isDragging, 
      'drag-over': isDragOver, 
      'full-width': size === 'full', 
      'resizing': isResizing,
      'drop-center': dropPosition === 'center',
      'drop-left': dropPosition === 'left',
      'drop-right': dropPosition === 'right',
      'drop-top': dropPosition === 'top',
      'drop-bottom': dropPosition === 'bottom'
    }"
    :style="{ gridColumn: size === 'full' ? 'span 2' : 'span 1' }"
    :draggable="!isResizing"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @dragend="handleDragEnd"
  >
    <div class="widget-content">
      <slot></slot>
    </div>
    <div
      class="resize-handle resize-handle-left"
      @mousedown.prevent="handleResizeStart($event, 'left')"
      @touchstart.prevent="handleResizeStart($event, 'left')"
    >
      <div class="resize-handle-icon">⋮</div>
    </div>
    <div
      class="resize-handle resize-handle-right"
      @mousedown.prevent="handleResizeStart($event, 'right')"
      @touchstart.prevent="handleResizeStart($event, 'right')"
    >
      <div class="resize-handle-icon">⋮</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseWidget',
  props: {
    widgetId: {
      type: [String, Number],
      required: true
    },
    size: {
      type: String,
      default: 'full',
      validator: (value) => ['half', 'full'].includes(value)
    }
  },
  emits: ['drag-start', 'drag-over', 'drop', 'resize'],
  data() {
    return {
      isDragging: false,
      isDragOver: false,
      isResizing: false,
      resizeStartX: 0,
      resizeStartSize: null,
      resizeThreshold: 30, // pixels to drag before toggling size (reduced for easier resizing)
      lastToggleX: 0, // Track where we last toggled to prevent rapid toggling
      resizeHandleSide: null, // Track which handle is being dragged ('left' or 'right')
      dropPosition: null // Track current drop position for visual feedback
    };
  },
  methods: {
    handleDragStart(event) {
      // Don't start drag if clicking on resize handle
      if (event.target.closest('.resize-handle')) {
        event.preventDefault();
        return false;
      }
      this.isDragging = true;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this.widgetId);
      event.dataTransfer.setData('widget-id', this.widgetId.toString());
      this.$emit('drag-start', { widgetId: this.widgetId, event });
    },
    handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      
      // Calculate drop position for visual feedback
      const rect = event.currentTarget.getBoundingClientRect();
      const dropX = event.clientX - rect.left;
      const dropY = event.clientY - rect.top;
      const widgetWidth = rect.width;
      const widgetHeight = rect.height;
      
      const centerX = widgetWidth / 2;
      const centerY = widgetHeight / 2;
      const distanceFromCenterX = Math.abs(dropX - centerX) / centerX;
      const distanceFromCenterY = Math.abs(dropY - centerY) / centerY;
      
      const isCenter = distanceFromCenterX < 0.5 && distanceFromCenterY < 0.5;
      const isLeft = dropX < centerX * 0.7;
      const isRight = dropX > centerX * 1.3;
      const isTop = dropY < centerY * 0.7;
      const isBottom = dropY > centerY * 1.3;
      
      this.isDragOver = true;
      
      // Set drop position for visual feedback
      if (isCenter) {
        this.dropPosition = 'center';
      } else if (isTop) {
        this.dropPosition = 'top';
      } else if (isBottom) {
        this.dropPosition = 'bottom';
      } else if (isLeft) {
        this.dropPosition = 'left';
      } else if (isRight) {
        this.dropPosition = 'right';
      } else {
        this.dropPosition = 'center'; // Default to center
      }
      
      this.$emit('drag-over', { 
        widgetId: this.widgetId, 
        isCenter,
        isLeft,
        isRight,
        isTop,
        isBottom,
        event 
      });
    },
    handleDragLeave(event) {
      // Only remove drag-over if we're actually leaving the widget
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX;
      const y = event.clientY;
      
      // Check if mouse is still within widget bounds
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.isDragOver = false;
        this.dropPosition = null;
      }
    },
    handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      this.isDragOver = false;
      this.dropPosition = null;
      const draggedWidgetId = event.dataTransfer.getData('widget-id');
      if (draggedWidgetId && draggedWidgetId !== this.widgetId.toString()) {
        // Calculate drop position relative to widget center
        const rect = event.currentTarget.getBoundingClientRect();
        const dropX = event.clientX - rect.left;
        const dropY = event.clientY - rect.top;
        const widgetWidth = rect.width;
        const widgetHeight = rect.height;
        
        // Calculate distance from center (normalized 0-1)
        const centerX = widgetWidth / 2;
        const centerY = widgetHeight / 2;
        const distanceFromCenterX = Math.abs(dropX - centerX) / centerX;
        const distanceFromCenterY = Math.abs(dropY - centerY) / centerY;
        
        // Improved center detection - more forgiving
        const isCenter = distanceFromCenterX < 0.5 && distanceFromCenterY < 0.5;
        
        // Determine drop side for better positioning
        const isLeft = dropX < centerX * 0.7;
        const isRight = dropX > centerX * 1.3;
        const isTop = dropY < centerY * 0.7;
        const isBottom = dropY > centerY * 1.3;
        
        this.$emit('drop', {
          draggedWidgetId: draggedWidgetId,
          targetWidgetId: this.widgetId,
          isCenter: isCenter,
          isLeft: isLeft,
          isRight: isRight,
          isTop: isTop,
          isBottom: isBottom,
          event
        });
      }
    },
    handleDragEnd(event) {
      this.isDragging = false;
      this.isDragOver = false;
      this.dropPosition = null;
    },
    handleResizeStart(event, side) {
      // Prevent widget drag when starting resize
      event.stopPropagation();
      event.preventDefault();
      
      this.isResizing = true;
      this.resizeHandleSide = side;
      const startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
      this.resizeStartX = startX;
      this.lastToggleX = startX;
      this.resizeStartSize = this.size;
      
      // Use capture phase to ensure we catch events even if nav interferes
      document.addEventListener('mousemove', this.handleResizeMove, { capture: true });
      document.addEventListener('mouseup', this.handleResizeEnd, { capture: true });
      document.addEventListener('touchmove', this.handleResizeMove, { capture: true });
      document.addEventListener('touchend', this.handleResizeEnd, { capture: true });
      
      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
    },
    handleResizeMove(event) {
      if (!this.isResizing) return;
      
      const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      const deltaX = currentX - this.resizeStartX;
      const deltaFromLastToggle = currentX - this.lastToggleX;
      
      // Determine if we should toggle based on distance from last toggle point
      const shouldToggle = Math.abs(deltaFromLastToggle) >= this.resizeThreshold;
      
      if (shouldToggle) {
        let newSize = this.resizeStartSize;
        
        // Determine new size based on which handle and drag direction
        if (this.resizeHandleSide === 'right') {
          // Right handle: dragging right expands, dragging left shrinks
          if (deltaX > 0) {
            newSize = 'full';
          } else {
            newSize = 'half';
          }
        } else {
          // Left handle: dragging left expands, dragging right shrinks (opposite)
          if (deltaX < 0) {
            newSize = 'full';
          } else {
            newSize = 'half';
          }
        }
        
        // Always allow toggle - don't check if size changed, allow toggling back and forth
        if (newSize !== this.resizeStartSize) {
          this.$emit('resize', {
            widgetId: this.widgetId,
            newSize: newSize
          });
          this.resizeStartSize = newSize; // Update current size
          this.lastToggleX = currentX; // Update toggle point
        }
      }
    },
    handleResizeEnd(event) {
      if (!this.isResizing) return;
      
      this.isResizing = false;
      this.resizeHandleSide = null;
      document.removeEventListener('mousemove', this.handleResizeMove, { capture: true });
      document.removeEventListener('mouseup', this.handleResizeEnd, { capture: true });
      document.removeEventListener('touchmove', this.handleResizeMove, { capture: true });
      document.removeEventListener('touchend', this.handleResizeEnd, { capture: true });
      
      // Restore text selection
      document.body.style.userSelect = '';
    }
  },
  beforeUnmount() {
    // Cleanup event listeners if component is destroyed during resize
    document.removeEventListener('mousemove', this.handleResizeMove, { capture: true });
    document.removeEventListener('mouseup', this.handleResizeEnd, { capture: true });
    document.removeEventListener('touchmove', this.handleResizeMove, { capture: true });
    document.removeEventListener('touchend', this.handleResizeEnd, { capture: true });
    document.body.style.userSelect = '';
  }
};
</script>

<style scoped>
.base-widget {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg);
  cursor: move;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 150px;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  grid-column: span 1;
  position: relative;
  overflow: visible;
  z-index: 1;
}

.base-widget.dragging,
.base-widget.resizing,
.base-widget.drag-over {
  z-index: 1002;
  position: relative;
}

.base-widget:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.base-widget.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing;
}

.base-widget.drag-over {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.02);
}

.base-widget.drop-center {
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.base-widget.drop-left {
  border-left-color: rgba(255, 255, 255, 0.7);
  border-left-width: 3px;
}

.base-widget.drop-right {
  border-right-color: rgba(255, 255, 255, 0.7);
  border-right-width: 3px;
}

.base-widget.drop-top {
  border-top-color: rgba(255, 255, 255, 0.7);
  border-top-width: 3px;
}

.base-widget.drop-bottom {
  border-bottom-color: rgba(255, 255, 255, 0.7);
  border-bottom-width: 3px;
}

.base-widget.resizing {
  cursor: ew-resize;
  user-select: none;
}

.widget-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: background 0.2s ease;
  touch-action: none;
  pointer-events: auto;
}

.resize-handle-left {
  left: 0;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.resize-handle-right {
  right: 0;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.resize-handle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.resize-handle:active {
  background: rgba(255, 255, 255, 0.12);
}

.resize-handle-icon {
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.resize-handle:hover .resize-handle-icon {
  opacity: 1;
}

.base-widget.resizing .resize-handle-icon {
  opacity: 1;
  color: rgba(255, 255, 255, 0.7);
}

.base-widget.resizing .resize-handle {
  background: rgba(255, 255, 255, 0.15);
}
</style>

