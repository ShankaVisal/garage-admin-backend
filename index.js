const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const filePath = './garages.json';

// Safe JSON read
const readData = () => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.trim()) return { garages: [] }; // Empty file fallback
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read or parse garages.json:', err.message);
    return { garages: [] }; // Fallback on any error
  }
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET all garages
app.get('/garages', (req, res) => {
  res.json(readData().garages);
});

// ADD new garage
app.post('/garages', (req, res) => {
  const data = readData();
  data.garages.push(req.body);
  writeData(data);
  res.status(201).json(req.body);
});

// UPDATE garage
app.put('/garages/:index', (req, res) => {
  const data = readData();
  data.garages[req.params.index] = req.body;
  writeData(data);
  res.json(req.body);
});

// DELETE garage
app.delete('/garages/:index', (req, res) => {
  const data = readData();
  const removed = data.garages.splice(req.params.index, 1);
  writeData(data);
  res.json(removed[0]);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
