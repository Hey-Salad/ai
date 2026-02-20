# 🔑 Get Your HuggingFace API Token

## Step-by-Step Instructions

### 1. Visit HuggingFace (30 seconds)

Open this link: **https://huggingface.co/settings/tokens**

### 2. Sign In or Sign Up (1 minute)

- If you have an account: Click **Sign In**
- If you're new: Click **Sign Up** (free, takes 1 minute)

### 3. Create Token (1 minute)

Once signed in:

1. You'll see "Access Tokens" page
2. Click the **"New token"** button
3. Fill in:
   - **Name:** `HeySalad AI` (or any name you want)
   - **Type:** Select **"Read"** (this is all you need)
4. Click **"Generate token"**
5. **Copy the token** - it looks like: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Save It

Copy the token to your clipboard. You'll need it in the next step!

---

## ⚠️ Important Notes

- **Keep your token secret** - it's like a password
- **Don't share it** publicly
- You can create multiple tokens if needed
- Tokens are free (no credit card required)

---

## 💰 HuggingFace Pricing

**Free Tier:**
- Great for testing and light usage
- Rate limited (a few requests per minute)
- Perfect for getting started

**Pro Tier ($9/month - optional):**
- Higher rate limits
- Faster response times
- Not needed to get started!

---

## ✅ Once You Have Your Token

Come back here and we'll set it up!

```bash
export HF_API_KEY="hf_your_token_here"
./GET_STARTED.sh
```

---

## ❓ Troubleshooting

**"I don't see the tokens page"**
→ Make sure you're logged in, then visit: https://huggingface.co/settings/tokens

**"The token doesn't work"**
→ Make sure you copied the entire token (starts with `hf_`)

**"Do I need to pay?"**
→ No! Free tier is perfect for getting started.

---

Ready? Get your token and come back! 🚀
