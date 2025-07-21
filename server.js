const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ Explicit route for Setup Agent page
app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setup_agent.html'));
});

// Catch-all fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot UI server running on port ${PORT}`);
});

