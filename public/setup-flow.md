# 🛠 Intelagent Chatbot Setup Flow

This is the official setup logic followed by the Setup Agent. It defines the expected user steps and how the chatbot will respond.

---

## ✅ Step 1: Greet the User

- Agent introduces itself as a Setup Agent.
- Politely asks user to provide their website domain (e.g., mystore.com or mystore.myshopify.com).

---

## ✅ Step 2: Confirm the Domain

- Agent repeats the submitted domain back to the user.
- Waits for explicit confirmation (user must reply "yes").

---

## ✅ Step 3: Generate Site Key

- Once confirmed, the agent triggers a site key creation workflow.
- The domain + site key are stored securely in the SiteKeys database table.

---

## ✅ Step 4: Display Embed Code

- Agent shows the user their chatbot embed code:

```html
<script src="https://cdn.intelagent.chatbot/widget.js" data-site="your_site_key_here"></script>
```

- Explains how to install it (e.g., in theme.liquid or footer of their website).

---

## ✅ Step 5: Offer Support

- If user has any questions, agent provides guidance on:
  - Resetting the setup
  - Troubleshooting
  - Where to paste the embed code

---

This flow ensures users complete setup smoothly, and agents stay on track.