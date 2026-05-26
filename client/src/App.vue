<script setup>
import { ref, onMounted } from 'vue'
 
const API = 'http://localhost:4000/api/items'
const items = ref([])
const form = ref({ name: '', description: '', price: '' })
const editId = ref(null)
 
async function load() {
  items.value = await fetch(API).then(r => r.json())
}
 
async function save() {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    price: parseFloat(form.value.price) || 0
  }
  if (editId.value) {
    await fetch(`${API}/${editId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    editId.value = null
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  form.value = { name: '', description: '', price: '' }
  load()
}
 
function startEdit(item) {
  editId.value = item.id
  form.value = { name: item.name, description: item.description, price: item.price }
}
 
function cancelEdit() {
  editId.value = null
  form.value = { name: '', description: '', price: '' }
}
 
async function remove(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' })
  load()
}
 
function formatPrice(price) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price)
}
 
onMounted(load)
</script>
 
<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-icon">◈</span>
          <span class="logo-text">Inventory</span>
        </div>
        <span class="item-count">{{ items.length }} items</span>
      </div>
    </header>
 
    <main class="main">
      <!-- Form Card -->
      <section class="card form-card">
        <h2 class="card-title">{{ editId ? '✦ Edit Item' : '✦ New Item' }}</h2>
        <form @submit.prevent="save" class="form">
          <div class="form-row">
            <div class="field">
              <label>Name</label>
              <input v-model="form.name" placeholder="Item name" required />
            </div>
            <div class="field field--price">
              <label>Price (₱)</label>
              <input v-model="form.price" type="number" step="0.01" min="0" placeholder="0.00" required />
            </div>
          </div>
          <div class="field">
            <label>Description</label>
            <input v-model="form.description" placeholder="Brief description" />
          </div>
          <div class="form-actions">
            <button v-if="editId" type="button" class="btn btn--ghost" @click="cancelEdit">Cancel</button>
            <button type="submit" class="btn btn--primary">
              {{ editId ? 'Update Item' : 'Add Item' }}
            </button>
          </div>
        </form>
      </section>
 
      <!-- Table Card -->
      <section class="card table-card">
        <div v-if="items.length === 0" class="empty">
          <span class="empty-icon">◎</span>
          <p>No items yet. Add one above.</p>
        </div>
 
        <table v-else class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th class="col-price">Price</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id" :class="{ 'row--editing': editId === item.id }">
              <td class="col-index">{{ index + 1 }}</td>
              <td class="col-name">{{ item.name }}</td>
              <td class="col-desc">{{ item.description || '—' }}</td>
              <td class="col-price">{{ formatPrice(item.price) }}</td>
              <td class="col-actions">
                <button class="action-btn action-btn--edit" @click="startEdit(item)" title="Edit">✎</button>
                <button class="action-btn action-btn--delete" @click="remove(item.id)" title="Delete">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
 
/* ── Base ── */
.app {
  min-height: 100vh;
  background: #0d0d0f;
  color: #e8e6e1;
  font-family: 'DM Mono', monospace;
}
 
/* ── Header ── */
.header {
  border-bottom: 1px solid #1f1f23;
  background: #0d0d0f;
  position: sticky;
  top: 0;
  z-index: 10;
}
 
.header-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
 
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
 
.logo-icon {
  font-size: 1.4rem;
  color: #c8f04a;
}
 
.logo-text {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
 
.item-count {
  font-size: 0.72rem;
  color: #555;
  border: 1px solid #222;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}
 
/* ── Main ── */
.main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
 
/* ── Cards ── */
.card {
  background: #111114;
  border: 1px solid #1f1f23;
  border-radius: 12px;
  overflow: hidden;
}
 
.card-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c8f04a;
  padding: 1.2rem 1.5rem 0;
  margin: 0;
}
 
/* ── Form ── */
.form {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
 
.form-row {
  display: flex;
  gap: 1rem;
}
 
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}
 
.field--price {
  flex: 0 0 160px;
}
 
.field label {
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555;
}
 
.field input {
  background: #0d0d0f;
  border: 1px solid #2a2a2e;
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  color: #e8e6e1;
  font-family: 'DM Mono', monospace;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
}
 
.field input:focus {
  border-color: #c8f04a;
}
 
.field input::placeholder {
  color: #333;
}
 
.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
 
.btn {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
 
.btn--primary {
  background: #c8f04a;
  color: #0d0d0f;
}
 
.btn--primary:hover {
  background: #d9f96e;
  transform: translateY(-1px);
}
 
.btn--ghost {
  background: transparent;
  color: #555;
  border: 1px solid #2a2a2e;
}
 
.btn--ghost:hover {
  color: #e8e6e1;
  border-color: #444;
}
 
/* ── Table ── */
.table {
  width: 100%;
  border-collapse: collapse;
}
 
.table thead tr {
  border-bottom: 1px solid #1f1f23;
}
 
.table th {
  padding: 0.85rem 1.2rem;
  text-align: left;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #444;
  font-weight: 500;
}
 
.table td {
  padding: 0.9rem 1.2rem;
  font-size: 0.85rem;
  border-bottom: 1px solid #18181b;
  vertical-align: middle;
}
 
.table tbody tr:last-child td {
  border-bottom: none;
}
 
.table tbody tr {
  transition: background 0.15s;
}
 
.table tbody tr:hover {
  background: #16161a;
}
 
.row--editing {
  background: #141a0a !important;
}
 
.col-index {
  color: #333;
  font-size: 0.72rem;
  width: 40px;
}
 
.col-name {
  font-weight: 500;
  color: #f0ede8;
}
 
.col-desc {
  color: #666;
  font-size: 0.8rem;
}
 
.col-price {
  font-weight: 500;
  color: #c8f04a;
  white-space: nowrap;
}
 
.col-actions {
  text-align: right;
  white-space: nowrap;
}
 
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.15s;
  margin-left: 4px;
}
 
.action-btn--edit {
  color: #888;
}
 
.action-btn--edit:hover {
  background: #1f2a10;
  color: #c8f04a;
}
 
.action-btn--delete {
  color: #555;
}
 
.action-btn--delete:hover {
  background: #2a1010;
  color: #f06a4a;
}
 
/* ── Empty State ── */
.empty {
  padding: 4rem 2rem;
  text-align: center;
  color: #333;
}
 
.empty-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.75rem;
}
 
.empty p {
  font-size: 0.85rem;
  margin: 0;
}
 
/* ── Responsive ── */
@media (max-width: 600px) {
  .main { padding: 1.5rem 1rem; }
  .header-inner { padding: 1rem; }
  .form-row { flex-direction: column; }
  .field--price { flex: 1; }
  .col-desc { display: none; }
}
</style>
 
