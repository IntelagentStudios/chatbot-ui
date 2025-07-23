const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ Proxy route to forward setup messages to the N8N webhook
app.post('/api/setup', async (req, res) => {
  try {
    const response = await fetch('https://intelagentchatbotn8n.up.railway.app/webhook-test/setup-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Proxy error:', err);
    res.status(500).json({ agent_message: "⚠️ Couldn't reach the setup server." });
  }
});

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

