# 🚀 Supabase Setup Guide

Follow these steps to set up cross-device message syncing with Supabase!

## 📋 Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub or email
4. Create a new project

## 🗄️ Step 2: Create Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the messages table:

```sql
CREATE TABLE love_messages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  style TEXT DEFAULT 'romantic',
  effects TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE love_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for simplicity)
CREATE POLICY "Allow all operations" ON love_messages
  FOR ALL USING (true);
```

## 🔑 Step 3: Get Your Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**
3. Update `features/message/supabase-config.js`:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

## ✅ Step 4: Test the Setup

1. Open your website
2. Go to "Send Me a Message"
3. Write a test message
4. Check if it appears in your Supabase dashboard under **Table Editor** → **love_messages**

## 🌟 Features You'll Get

- ✅ **Real-time sync** across all devices
- ✅ **Messages stored securely** in the cloud
- ✅ **Instant notifications** when new messages arrive
- ✅ **Works on any device** (phone, tablet, computer)
- ✅ **No setup needed** for users - just works!

## 🔧 Troubleshooting

**If messages don't send:**
- Check browser console for errors
- Verify your Supabase credentials are correct
- Make sure the table was created properly

**If you can't see messages:**
- Check if the Supabase client is loading
- Verify the table has data in Supabase dashboard

## 💕 That's It!

Once set up, your love messages will sync perfectly across all devices! 

**For her:** Write messages on her phone, you'll see them on your computer
**For you:** Check messages on your laptop, she'll see them on her phone

---

🎉 **Enjoy your cross-device love messaging!** 💌 