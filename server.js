import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ✅ Route for Setup Agent page
app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setup_agent.html'));
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot UI server running on port ${PORT}`);
});


