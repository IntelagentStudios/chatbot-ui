const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static widget + HTML from /public
app.use(express.static(path.join(__dirname, 'public')));

// Optional fallback for SPA-style routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot UI server running on port ${PORT}`);
});
