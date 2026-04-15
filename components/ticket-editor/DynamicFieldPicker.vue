<template>
  <section class="picker">
    <h3>Dynamic fields</h3>
    <input v-model="query" placeholder="Find token..." />
    <div class="tokens">
      <button v-for="token in filtered" :key="token.key" @click="$emit('insert', token.key)">
        <small>{{ token.category }}</small>
        <span>{{ token.label }}</span>
        <code>{{`{{${token.key}}}`}}</code>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTicketEditorStore } from '~/stores/ticketEditor'

defineEmits<{
  (event: 'insert', token: string): void
}>()

const store = useTicketEditorStore()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.dynamicFields.filter(token =>
    [token.key, token.label, token.category].join(' ').toLowerCase().includes(q),
  )
})
</script>

<style scoped>
.picker {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
}

.tokens {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow: auto;
}

button {
  display: grid;
  justify-items: start;
  gap: 2px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  padding: 8px;
  text-align: left;
}

small {
  color: #6b7280;
  font-size: 10px;
}

code {
  font-size: 11px;
  color: #1d4ed8;
}
</style>
