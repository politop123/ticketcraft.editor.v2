<template>
  <section>
    <h3>Layers</h3>
    <div class="layers">
      <button
        v-for="layer in reversed"
        :key="layer.id"
        class="layer"
        :class="{ selected: store.selectedIds.includes(layer.id) }"
        @click="store.select(layer.id, $event.shiftKey)"
      >
        <span>{{ layer.name }}</span>
        <div class="actions">
          <button @click.stop="store.toggleVisibility(layer.id)">{{ layer.visible ? 'Hide' : 'Show' }}</button>
          <button @click.stop="store.toggleLock(layer.id)">{{ layer.locked ? 'Unlock' : 'Lock' }}</button>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'

const store = useTicketEditorStore()
const reversed = computed(() => [...store.orderedElements].reverse())
</script>

<style scoped>
.layers {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow: auto;
}

.layer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  padding: 8px;
}

.layer.selected {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.actions {
  display: flex;
  gap: 4px;
}

.actions button {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 2px 6px;
  background: #f9fafb;
  font-size: 11px;
}
</style>
