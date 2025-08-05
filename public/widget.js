(function() {
  // Get the site key from the script tag
  const script = document.currentScript;
  const siteKey = script.getAttribute('data-site');
  
  if (!siteKey) {
    console.error('IntelagentChat: No site key provided');
    return;
  }

  // Generate/retrieve session ID
  const sessionId = localStorage.getItem('intelagent_session_id') || `sess_${Math.random().toString(36).substring(2, 10)}`;
  localStorage.setItem('intelagent_session_id', sessionId);
  
  // Check if widget already exists (for page navigation)
  if (window.intelagentChatInitialized) {
    return;
  }
  window.intelagentChatInitialized = true;
  
  // Webhook URL
  const webhookUrl = 'https://intelagentchatbotn8n.up.railway.app/webhook/chatbot';

  // Add styles with improved spacing and text size
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    .intelagent-chat-button {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px) saturate(150%);
      -webkit-backdrop-filter: blur(12px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      width: 68px;
      height: 68px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      z-index: 1000000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .intelagent-chat-button:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }
    .intelagent-chat-button svg {
      width: 30px;
      height: 30px;
      fill: #333;
    }
    .intelagent-chat-box {
      position: fixed;
      bottom: 110px;
      right: 28px;
      width: 380px;
      max-height: 600px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(24px) saturate(150%);
      -webkit-backdrop-filter: blur(24px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .intelagent-chat-header {
      background-color: rgba(248, 248, 248, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 20px 24px;
      font-size: 20px;
      color: #1a1a1a;
      font-weight: 600;
      border-bottom: 1px solid rgba(230, 230, 230, 0.5);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .intelagent-close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: #666;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }
    .intelagent-close-button:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #333;
    }
    .intelagent-chat-messages {
      flex-grow: 1;
      padding: 24px;
      overflow-y: auto;
      font-size: 16px;
      color: #333;
      line-height: 1.6;
      scroll-behavior: smooth;
    }
    .intelagent-chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    .intelagent-chat-messages::-webkit-scrollbar-track {
      background: rgba(241, 241, 241, 0.3);
      border-radius: 3px;
    }
    .intelagent-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.4);
      border-radius: 3px;
    }
    .intelagent-chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(85, 85, 85, 0.6);
    }
    .intelagent-message {
      margin: 16px 0;
      display: flex;
      align-items: flex-start;
      animation: fadeInUp 0.3s ease-out;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .intelagent-message.user {
      justify-content: flex-end;
    }
    .intelagent-message.bot {
      justify-content: flex-start;
    }
    .intelagent-message-content {
      max-width: 75%;
      padding: 12px 18px;
      border-radius: 18px;
      word-wrap: break-word;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .intelagent-message.user .intelagent-message-content {
      background: linear-gradient(135deg, rgba(59, 59, 59, 0.95) 0%, rgba(41, 41, 41, 0.95) 100%);
      color: white;
      border-bottom-right-radius: 6px;
    }
    .intelagent-message.bot .intelagent-message-content {
      background: rgba(243, 243, 243, 0.9);
      color: #1a1a1a;
      border-bottom-left-radius: 6px;
    }
    .intelagent-message.bot .intelagent-message-content a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .intelagent-message.bot .intelagent-message-content a:hover {
      color: #0052a3;
      text-decoration: underline;
    }
    .intelagent-message strong {
      display: block;
      font-size: 13px;
      margin-bottom: 6px;
      opacity: 0.6;
      font-weight: 500;
    }
    .intelagent-chat-input {
      display: flex;
      border-top: 1px solid rgba(230, 230, 230, 0.4);
      padding: 16px;
      background: rgba(255, 255, 255, 0.6);
      min-height: 68px;
      gap: 12px;
      align-items: flex-end;
    }
    .intelagent-chat-input textarea {
      flex-grow: 1;
      padding: 12px 16px;
      border: 1px solid rgba(204, 204, 204, 0.4);
      border-radius: 12px;
      font-size: 16px;
      outline: none;
      font-family: 'Inter', sans-serif;
      background: rgba(255, 255, 255, 0.8);
      resize: none;
      min-height: 44px;
      max-height: 120px;
      overflow-y: auto;
      line-height: 1.5;
      transition: border-color 0.2s;
    }
    .intelagent-chat-input textarea:focus {
      border-color: rgba(100, 100, 100, 0.6);
      background: rgba(255, 255, 255, 0.95);
    }
    .intelagent-send-button {
      background: rgba(59, 59, 59, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .intelagent-send-button:hover {
      background: rgba(41, 41, 41, 0.95);
      transform: scale(1.05);
    }
    .intelagent-send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .intelagent-send-button svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
    .intelagent-chat-footer {
      font-size: 11px;
      text-align: center;
      color: #999;
      padding: 12px;
      background: rgba(250, 250, 250, 0.6);
      border-top: 1px solid rgba(230, 230, 230, 0.3);
    }
    .intelagent-typing-indicator {
      display: inline-block;
      padding: 12px 18px;
      background: rgba(243, 243, 243, 0.9);
      border-radius: 18px;
      border-bottom-left-radius: 6px;
      margin: 16px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .intelagent-typing-indicator span {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 3px;
      background: rgba(153, 153, 153, 0.6);
      border-radius: 50%;
      animation: intelagent-blink 1.4s infinite both;
    }
    .intelagent-typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .intelagent-typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes intelagent-blink {
      0%, 80%, 100% { 
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% { 
        transform: scale(1);
        opacity: 1;
      }
    }
    pre {
      background: rgba(244, 244, 244, 0.9);
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 14px;
      margin: 8px 0;
    }
    @media (max-width: 480px) {
      .intelagent-chat-box {
        width: calc(100vw - 32px);
        right: 16px;
        bottom: 90px;
        max-height: 70vh;
      }
      .intelagent-chat-button {
        right: 16px;
        bottom: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // Load chat history from localStorage
  function loadChatHistory() {
    const savedHistory = localStorage.getItem('intelagent_chat_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  }

  // Save chat history to localStorage
  function saveChatHistory(messages) {
    localStorage.setItem('intelagent_chat_history', JSON.stringify(messages));
  }

  // Clear chat history
  function clearChatHistory() {
    localStorage.removeItem('intelagent_chat_history');
    chatHistory = [];
  }

  let chatHistory = loadChatHistory();

  // Create chat button with your original icon
  const chatButton = document.createElement('div');
  chatButton.className = 'intelagent-chat-button';
  chatButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;

  // Create chat box
  const chatBox = document.createElement('div');
  chatBox.className = 'intelagent-chat-box';
  chatBox.innerHTML = `
    <div class="intelagent-chat-header">
      <span>Chat Assistant</span>
      <button class="intelagent-close-button" aria-label="Close chat">×</button>
    </div>
    <div class="intelagent-chat-messages" id="intelagent-messages"></div>
    <div class="intelagent-chat-input">
      <textarea id="intelagent-input" placeholder="Type your message..." rows="1"></textarea>
      <button class="intelagent-send-button" id="intelagent-send" aria-label="Send message">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="intelagent-chat-footer">Powered by Intelagent Studios</div>
  `;

  // Function to render all messages
  function renderMessages() {
    const messagesDiv = document.getElementById('intelagent-messages');
    messagesDiv.innerHTML = '';
    
    // Add initial bot message if no history
    if (chatHistory.length === 0) {
      const initialMsg = {
        type: 'bot',
        content: 'How can I help you today?',
        timestamp: new Date().toISOString()
      };
      chatHistory.push(initialMsg);
      saveChatHistory(chatHistory);
    }
    
    // Render all messages
    chatHistory.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `intelagent-message ${msg.type}`;
      msgDiv.innerHTML = `
        <div class="intelagent-message-content">
          <strong>${msg.type === 'user' ? 'You' : 'Assistant'}</strong>
          ${msg.content}
        </div>
      `;
      messagesDiv.appendChild(msgDiv);
    });
    
    // Scroll to bottom after rendering
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Toggle chat visibility
  let isChatOpen = false;
  
  function toggleChat() {
    isChatOpen = !isChatOpen;
    chatBox.style.display = isChatOpen ? 'flex' : 'none';
    if (isChatOpen) {
      renderMessages();
      document.getElementById('intelagent-input').focus();
    }
  }

  chatButton.addEventListener('click', toggleChat);
  
  // Close button functionality
  const closeButton = chatBox.querySelector('.intelagent-close-button');
  closeButton.addEventListener('click', toggleChat);

  // Add typing indicator
  function showTypingIndicator() {
    const messagesDiv = document.getElementById('intelagent-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'intelagent-message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="intelagent-typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  // Improved scroll function that scrolls to the top of new messages
  function scrollToMessage(messageElement) {
    const messagesDiv = document.getElementById('intelagent-messages');
    const messageTop = messageElement.offsetTop;
    const containerHeight = messagesDiv.clientHeight;
    const messageHeight = messageElement.clientHeight;
    
    // If the message fits in view, scroll to show it at the top with some padding
    if (messageHeight < containerHeight) {
      messagesDiv.scrollTop = messageTop - 24; // 24px padding from top
    } else {
      // If message is longer than container, just scroll to top of message
      messagesDiv.scrollTop = messageTop;
    }
  }

  // Send message function
  async function sendMessage(message) {
    const messagesDiv = document.getElementById('intelagent-messages');
    
    // Add user message to history
    const userMsg = {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    chatHistory.push(userMsg);
    saveChatHistory(chatHistory);
    
    // Add user message to UI
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'intelagent-message user';
    userMsgDiv.innerHTML = `
      <div class="intelagent-message-content">
        <strong>You</strong>
        ${message}
      </div>
    `;
    messagesDiv.appendChild(userMsgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Disable input while processing
    const inputTextarea = document.getElementById('intelagent-input');
    const sendButton = document.getElementById('intelagent-send');
    inputTextarea.disabled = true;
    sendButton.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
      // Build chat history string for context
      const historyString = chatHistory.slice(-10).map(msg => 
        `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          session_id: sessionId,
          site_key: siteKey,
          chat_history: historyString
        })
      });

      const data = await response.json();
      removeTypingIndicator();

      // Add bot response with formatting and clickable links
      const botResponse = data.message || data.chatbot_response || 'I apologize, but I encountered an error processing your request.';
      const formattedResponse = botResponse
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')  // Escape HTML first
        .replace(/```html\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>')  // Make URLs clickable
        .replace(/\n/g, '<br>');

      // Add bot message to history
      const botMsg = {
        type: 'bot',
        content: formattedResponse,
        timestamp: new Date().toISOString()
      };
      chatHistory.push(botMsg);
      saveChatHistory(chatHistory);

      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'intelagent-message bot';
      botMsgDiv.innerHTML = `
        <div class="intelagent-message-content">
          <strong>Assistant</strong>
          ${formattedResponse}
        </div>
      `;
      messagesDiv.appendChild(botMsgDiv);
      
      // Scroll to the top of the new message
      scrollToMessage(botMsgDiv);

    } catch (error) {
      removeTypingIndicator();
      console.error('IntelagentChat Error:', error);
      
      const errorMsg = {
        type: 'bot',
        content: 'Sorry, I\'m having trouble connecting to the chat service. Please try again later.',
        timestamp: new Date().toISOString()
      };
      chatHistory.push(errorMsg);
      saveChatHistory(chatHistory);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'intelagent-message bot';
      errorDiv.innerHTML = `
        <div class="intelagent-message-content">
          <strong>Assistant</strong>
          ${errorMsg.content}
        </div>
      `;
      messagesDiv.appendChild(errorDiv);
      scrollToMessage(errorDiv);
    } finally {
      // Re-enable input
      inputTextarea.disabled = false;
      sendButton.disabled = false;
      inputTextarea.focus();
    }
  }

  // Auto-resize textarea function
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  // Handle input
  const inputTextarea = chatBox.querySelector('#intelagent-input');
  const sendButton = chatBox.querySelector('#intelagent-send');
  
  // Auto-resize on input
  inputTextarea.addEventListener('input', function() {
    autoResizeTextarea(this);
  });
  
  // Send button click
  sendButton.addEventListener('click', async () => {
    const message = inputTextarea.value.trim();
    if (message) {
      inputTextarea.value = '';
      autoResizeTextarea(inputTextarea);
      await sendMessage(message);
    }
  });
  
  // Handle enter key - send on Enter, new line on Shift+Enter
  inputTextarea.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = e.target.value.trim();
      if (message) {
        e.target.value = '';
        autoResizeTextarea(e.target);
        await sendMessage(message);
      }
    }
  });

  // Add keyboard shortcut to open chat (Ctrl/Cmd + /)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      toggleChat();
    }
  });

  // Add method to clear chat to window object
  window.clearIntelagentChat = function() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      clearChatHistory();
      renderMessages();
    }
  };

  // Append elements to page
  document.body.appendChild(chatButton);
  document.body.appendChild(chatBox);
  
  // Restore chat state if it was open
  const wasChatOpen = localStorage.getItem('intelagent_chat_open') === 'true';
  if (wasChatOpen) {
    toggleChat();
  }
  
  // Save chat state on toggle
  const originalToggle = toggleChat;
  toggleChat = function() {
    originalToggle();
    localStorage.setItem('intelagent_chat_open', isChatOpen.toString());
  };
})();