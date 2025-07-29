(function() {
  // Generate/retrieve session ID for setup
  const sessionId = localStorage.getItem('setup_session_id') || 'sess_' + Math.random().toString(36).substring(2, 10);
  localStorage.setItem('setup_session_id', sessionId);

  // Add styles - copying from setup_agent.html and matching widget.js pattern
  const style = document.createElement('style');
  style.textContent = `
    .intelagent-setup-button {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background-color: #ffffffcc;
      border: 2px solid #ccc;
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000000;
      transition: transform 0.2s;
    }
    .intelagent-setup-button:hover {
      transform: scale(1.05);
    }
    .intelagent-setup-button svg {
      width: 28px;
      height: 28px;
      fill: #333;
    }
    .intelagent-setup-box {
      position: fixed;
      bottom: 100px;
      left: 24px;
      width: 400px;
      max-height: 580px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .intelagent-setup-header {
      padding: 32px 32px 16px;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;
    }
    .intelagent-setup-header h1 {
      font-size: 24px;
      margin: 0 0 16px 0;
      font-weight: 600;
    }
    .intelagent-setup-header p {
      font-size: 14px;
      margin: 0;
      color: #666;
    }
    .intelagent-setup-messages {
      flex-grow: 1;
      text-align: left;
      max-height: 300px;
      overflow-y: auto;
      background: #f1f1f1;
      padding: 10px;
      font-size: 14px;
      margin: 16px;
      border-radius: 8px;
    }
    .intelagent-setup-messages::-webkit-scrollbar {
      width: 6px;
    }
    .intelagent-setup-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    .intelagent-setup-messages::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    .intelagent-setup-messages::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    .intelagent-setup-messages div {
      margin: 10px 0;
      line-height: 1.5;
    }
    .intelagent-setup-messages div strong {
      display: block;
      margin-bottom: 3px;
    }
    .intelagent-setup-messages pre {
      background: #eaeaea;
      padding: 8px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 13px;
    }
    .intelagent-setup-input-area {
      padding: 0 16px 16px;
    }
    .intelagent-setup-input {
      width: 100%;
      padding: 10px;
      font-size: 14px;
      margin-top: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-sizing: border-box;
    }
    .intelagent-setup-input:focus {
      outline: none;
      border-color: #999;
    }
    .intelagent-setup-send {
      padding: 10px 16px;
      font-size: 14px;
      margin-top: 10px;
      border-radius: 6px;
      background: #333;
      color: white;
      border: none;
      cursor: pointer;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      width: 100%;
    }
    .intelagent-setup-send:hover {
      background: #555;
    }
    .intelagent-setup-footer {
      font-size: 12px;
      color: #999;
      text-align: center;
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }
    .intelagent-typing-indicator {
      display: inline-block;
      padding-left: 10px;
    }
    .intelagent-typing-indicator span {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin: 0 1px;
      background: #999;
      border-radius: 50%;
      animation: intelagent-blink-setup 1.4s infinite both;
    }
    .intelagent-typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .intelagent-typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes intelagent-blink-setup {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Create setup button with gear icon (matching widget.js pattern)
  const setupButton = document.createElement('div');
  setupButton.className = 'intelagent-setup-button';
  setupButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>`;

  // Create setup box (matching setup_agent.html structure)
  const setupBox = document.createElement('div');
  setupBox.className = 'intelagent-setup-box';
  setupBox.innerHTML = `
    <div class="intelagent-setup-header">
      <h1>Intelagent Chatbot Setup</h1>
      <p>I'll help you connect your domain and generate your personalized chatbot key.</p>
    </div>
    <div class="intelagent-setup-messages" id="intelagent-setup-messages"></div>
    <div class="intelagent-setup-input-area">
      <input class="intelagent-setup-input" id="intelagent-setup-input" placeholder="Type your message..." type="text" autofocus/>
      <button class="intelagent-setup-send" id="intelagent-setup-send">Send</button>
    </div>
    <div class="intelagent-setup-footer">powered by Intelagent Studios</div>
  `;

  // Toggle setup visibility (matching widget.js pattern)
  setupButton.addEventListener('click', () => {
    setupBox.style.display = setupBox.style.display === 'flex' ? 'none' : 'flex';
    if (setupBox.style.display === 'flex') {
      document.getElementById('intelagent-setup-input').focus();
      // Initialize on first open
      if (!setupBox.hasAttribute('data-initialized')) {
        initializeSetup();
        setupBox.setAttribute('data-initialized', 'true');
      }
    }
  });

  // Send message function (copying from setup_agent.html)
  async function sendMessage(messageOverride) {
    const input = document.getElementById('intelagent-setup-input');
    const chatLog = document.getElementById('intelagent-setup-messages');
    const message = messageOverride || input.value.trim();
    if (!message) return;

    chatLog.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    chatLog.innerHTML += `<div id="typing-indicator" class="intelagent-typing-indicator"><span></span><span></span><span></span></div>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    input.value = '';

    try {
      // Determine API endpoint
      const currentHost = window.location.hostname;
      let apiUrl = '/api/setup';
      
      // Only use full URL for localhost
      if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        apiUrl = `http://localhost:${window.location.port || 3000}/api/setup`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: message,
          store_id: 'chatbot_setup',
          session_id: sessionId
        })
      });

      const data = await response.json();
      const agentReply = Array.isArray(data) ? data[0]?.agent_message : data?.agent_message || '⚠️ No response from agent.';
      const formattedReply = agentReply
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')  // escape HTML
        .replace(/```html\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')  // format code blocks
        .replace(/\n/g, '<br>'); // line breaks

      const loader = document.getElementById('typing-indicator');
      if (loader) loader.remove();
      chatLog.innerHTML += `<div><strong>Agent:</strong> ${formattedReply}</div>`;
      chatLog.scrollTop = chatLog.scrollHeight;
    } catch (err) {
      const loader = document.getElementById('typing-indicator');
      if (loader) loader.remove();
      chatLog.innerHTML += `<div><strong>Agent:</strong> ⚠️ Couldn't reach the setup server. Try again later.</div>`;
      console.warn(err);
    }
  }

  // Initialize setup (copying from setup_agent.html)
  function initializeSetup() {
    const input = document.getElementById('intelagent-setup-input');
    const button = document.getElementById('intelagent-setup-send');
    const chatLog = document.getElementById('intelagent-setup-messages');

    button.addEventListener('click', () => sendMessage());
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });

    // Initial message
    chatLog.innerHTML = `<div><strong>Agent:</strong> Hi, I'm your setup agent.<br>Unless you have any questions, please provide your website address to start setting up your chatbot.</div>`;
  }

  // Append elements to page
  document.body.appendChild(setupButton);
  document.body.appendChild(setupBox);
})();