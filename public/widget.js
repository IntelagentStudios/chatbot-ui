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
  
  // Webhook URL
  const webhookUrl = 'https://intelagentchatbotn8n.up.railway.app/webhook/chatbot';

  // Add styles with updated font and semi-transparent background
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
    
    .intelagent-chat-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1000000;
      transition: transform 0.2s;
    }
    .intelagent-chat-button:hover {
      transform: scale(1.05);
    }
    .intelagent-chat-button svg {
      width: 28px;
      height: 28px;
      fill: #333;
    }
    .intelagent-chat-box {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 320px;
      max-height: 480px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: 'Varela Round', sans-serif;
    }
    .intelagent-chat-header {
      background-color: rgba(245, 245, 245, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 12px 16px;
      font-size: 18px;
      color: #333;
      font-weight: 600;
      border-bottom: 1px solid rgba(224, 224, 224, 0.5);
      text-transform: capitalize;
    }
    .intelagent-chat-messages {
      flex-grow: 1;
      padding: 16px;
      overflow-y: auto;
      font-size: 14px;
      color: #444;
      line-height: 1.5;
    }
    .intelagent-chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    .intelagent-chat-messages::-webkit-scrollbar-track {
      background: rgba(241, 241, 241, 0.5);
      border-radius: 3px;
    }
    .intelagent-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.5);
      border-radius: 3px;
    }
    .intelagent-chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(85, 85, 85, 0.7);
    }
    .intelagent-message {
      margin: 8px 0;
      display: flex;
      align-items: flex-start;
    }
    .intelagent-message.user {
      justify-content: flex-end;
    }
    .intelagent-message.bot {
      justify-content: flex-start;
    }
    .intelagent-message-content {
      max-width: 75%;
      padding: 8px 12px;
      border-radius: 12px;
      word-wrap: break-word;
    }
    .intelagent-message.user .intelagent-message-content {
      background: rgba(51, 51, 51, 0.9);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .intelagent-message.bot .intelagent-message-content {
      background: rgba(241, 241, 241, 0.8);
      color: #333;
      border-bottom-left-radius: 4px;
    }
    .intelagent-message.bot .intelagent-message-content a {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
    }
    .intelagent-message.bot .intelagent-message-content a:hover {
      text-decoration: underline;
    }
    .intelagent-message strong {
      display: block;
      font-size: 12px;
      margin-bottom: 4px;
      opacity: 0.7;
    }
    .intelagent-chat-input {
      display: flex;
      border-top: 1px solid rgba(224, 224, 224, 0.3);
      padding: 8px;
      background: rgba(255, 255, 255, 0.5);
      min-height: 52px;
    }
    .intelagent-chat-input textarea {
      flex-grow: 1;
      padding: 8px 12px;
      border: 1px solid rgba(204, 204, 204, 0.5);
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      font-family: 'Varela Round', sans-serif;
      background: rgba(255, 255, 255, 0.7);
      resize: none;
      min-height: 36px;
      max-height: 120px;
      overflow-y: auto;
      line-height: 1.4;
    }
    .intelagent-chat-input textarea:focus {
      border-color: rgba(153, 153, 153, 0.8);
    }
    .intelagent-chat-footer {
      font-size: 10px;
      text-align: center;
      color: #aaa;
      padding: 6px;
      background: rgba(250, 250, 250, 0.8);
    }
    .intelagent-typing-indicator {
      display: inline-block;
      padding: 8px 12px;
      background: rgba(241, 241, 241, 0.8);
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      margin: 8px 0;
    }
    .intelagent-typing-indicator span {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 2px;
      background: rgba(153, 153, 153, 0.8);
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
        transform: scale(0);
        opacity: 0.5;
      }
      40% { 
        transform: scale(1);
        opacity: 1;
      }
    }
    pre {
      background: rgba(244, 244, 244, 0.8);
      padding: 8px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 12px;
      margin: 4px 0;
    }
  `;
  document.head.appendChild(style);

  // Create chat button with your original icon
  const chatButton = document.createElement('div');
  chatButton.className = 'intelagent-chat-button';
  chatButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;

  // Create chat box
  const chatBox = document.createElement('div');
  chatBox.className = 'intelagent-chat-box';
  chatBox.innerHTML = `
    <div class="intelagent-chat-header">Live Chat</div>
    <div class="intelagent-chat-messages" id="intelagent-messages">
      <div class="intelagent-message bot">
        <div class="intelagent-message-content">
          <strong>Virtual Assistant</strong>
          Hello! How can I help you today?
        </div>
      </div>
    </div>
    <div class="intelagent-chat-input">
      <textarea id="intelagent-input" placeholder="Type your message..." rows="1"></textarea>
    </div>
    <div class="intelagent-chat-footer">Powered by Intelagent Studios</div>
  `;

  // Toggle chat visibility
  chatButton.addEventListener('click', () => {
    chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    if (chatBox.style.display === 'flex') {
      document.getElementById('intelagent-input').focus();
    }
  });

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
      messagesDiv.scrollTop = messageTop - 16; // 16px padding from top
    } else {
      // If message is longer than container, just scroll to top of message
      messagesDiv.scrollTop = messageTop;
    }
  }

  // Send message function
  async function sendMessage(message) {
    const messagesDiv = document.getElementById('intelagent-messages');
    
    // Add user message
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

    // Show typing indicator
    showTypingIndicator();

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          session_id: sessionId,
          site_key: siteKey
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

      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'intelagent-message bot';
      botMsgDiv.innerHTML = `
        <div class="intelagent-message-content">
          <strong>Virtual Assistant</strong>
          ${formattedResponse}
        </div>
      `;
      messagesDiv.appendChild(botMsgDiv);
      
      // Scroll to the top of the new message instead of the bottom
      scrollToMessage(botMsgDiv);

    } catch (error) {
      removeTypingIndicator();
      console.error('IntelagentChat Error:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'intelagent-message bot';
      errorDiv.innerHTML = `
        <div class="intelagent-message-content">
          <strong>Virtual Assistant</strong>
          Sorry, I'm having trouble connecting to the chat service. Please try again later.
        </div>
      `;
      messagesDiv.appendChild(errorDiv);
      scrollToMessage(errorDiv);
    }
  }

  // Auto-resize textarea function
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  // Handle input
  const inputTextarea = chatBox.querySelector('#intelagent-input');
  
  // Auto-resize on input
  inputTextarea.addEventListener('input', function() {
    autoResizeTextarea(this);
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

  // Append elements to page
  document.body.appendChild(chatButton);
  document.body.appendChild(chatBox);
})();