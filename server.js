const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000; // or any port you prefer

let visitCount = 0;

// Load visit count from a file on startup
if (fs.existsSync('visitCount.json')) {
  const data = fs.readFileSync('visitCount.json');
  visitCount = JSON.parse(data).count;
}

// Middleware to parse JSON requests
app.use(express.json());

// API to get visit count
app.get('/api/visit-count', (req, res) => {
  res.json({ count: visitCount });
});

// API to increment visit count
app.post('/api/visit-count', (req, res) => {
  visitCount++;
  fs.writeFileSync('visitCount.json', JSON.stringify({ count: visitCount }));
  res.json({ count: visitCount });
});

// Serve static files (your HTML file and others)
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
