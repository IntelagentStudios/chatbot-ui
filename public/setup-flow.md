# 🧭 Intelagent Chatbot Setup Flow Guide

This is the official setup logic followed by the Setup Agent. It defines the expected user steps and how the chatbot will respond.

---

## 🎯 Goals
- Collect and confirm the user’s domain
- Generate a unique `site_key`
- Present the embed code using that key
- Store `site_key` + `domain` securely via output

---

## 🧠 Memory Keys Used

| Key               | Description                              |
|------------------|------------------------------------------|
| `domain`          | User’s provided website domain            |
| `domain_confirmed`| Boolean — has the user confirmed the domain? |
| `site_key`        | Secure, unique key for their chatbot      |

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
- A secure, unique site key is generated (12–16 alphanumeric).
- The domain + site key are stored securely in the `site_keys` database table.

---

## ✅ Step 4: Display Embed Code

- Agent shows the user their chatbot embed code:

```html
<script src="https://cdn.intelagent.chatbot/widget.js" data-site="SITE_KEY_HERE"></script>
```

- Explains how to install it (e.g., in theme.liquid or the footer of their website).

---

## ✅ Step 5: Offer Support

- If the user has any questions, agent provides guidance on:
  - Resetting the setup
  - Troubleshooting
  - Where to paste the embed code

---

## 🧠 Behavior Summary

- If `domain` not stored → Ask for domain
- If domain exists but not confirmed → Ask for confirmation
- If user replies “yes” → Confirm, generate key, and continue
- If user replies “no” → Ask again
- If `domain_confirmed` and `site_key` exist → Show embed

---

This flow ensures users complete setup smoothly and agents stay on track.