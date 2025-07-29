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
    console.log('📧 Proxying setup request to N8N webhook...');
    console.log('Request body:', req.body);
    
    const response = await fetch('https://intelagentchatbotn8n.up.railway.app/webhook/setup-agent', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Intelagent-Setup-Proxy/1.0'
      },
      body: JSON.stringify(req.body),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`N8N webhook returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ N8N webhook response received');
    
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ 
      output: "⚠️ Couldn't reach the setup server. Please try again in a moment.",
      error: true,
      message: err.message
    });
  }
});

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Intelagent Setup Proxy'
  });
});

// ✅ Route for Setup Agent page
app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setup_agent.html'));
});

// ✅ Route for setup agent (alternative path)
app.get('/setup_agent', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setup_agent.html'));
});

// Fallback route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Intelagent Setup Proxy server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Setup page: http://localhost:${PORT}/setup_agent`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

