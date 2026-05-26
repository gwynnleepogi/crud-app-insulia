// routes/items.js
const express = require('express');
const router = express.Router();

// NOTE: Replace this in-memory store with your actual DB (e.g. Sequelize/Knex)
// and make sure your items table has a `price` DECIMAL column.
let items = [];
let nextId = 1;

// GET all items
router.get('/', (req, res) => {
  res.json(items);
});

// GET single item
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST create
router.post('/', (req, res) => {
  const { name, description, price } = req.body;
  const item = {
    id: nextId++,
    name,
    description: description || '',
    price: parseFloat(price) || 0
  };
  items.push(item);
  res.status(201).json(item);
});

// PUT update
router.put('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  const { name, description, price } = req.body;
  item.name = name ?? item.name;
  item.description = description ?? item.description;
  item.price = price !== undefined ? parseFloat(price) || 0 : item.price;
  res.json(item);
});

// DELETE
router.delete('/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;