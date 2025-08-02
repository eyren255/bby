# 🏆 Scoreboard Database Setup

This guide shows you how to set up the database tables for syncing game scores across devices.

## 🗄️ **Create the Scoreboard Tables**

Run these SQL commands in your Supabase dashboard:

### 1. **Game Scores Table**
```sql
CREATE TABLE game_scores (
  id BIGSERIAL PRIMARY KEY,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON game_scores
  FOR ALL USING (true);
```

### 2. **Game Stats Table**
```sql
CREATE TABLE game_stats (
  id BIGSERIAL PRIMARY KEY,
  game_name TEXT UNIQUE NOT NULL,
  stats JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON game_stats
  FOR ALL USING (true);
```

## 🎮 **What Gets Synced**

### **Love Spin Wheel**
- ✅ **Spin Count** - Total spins across all devices
- ✅ **Best Result** - Highest point reward achieved
- ✅ **Total Points** - Accumulated points from all spins
- ✅ **High Scores** - Best individual spin results

### **Memory Match Game**
- ✅ **Best Scores** - Lowest moves for each difficulty level
- ✅ **Completion Times** - Fastest completion times
- ✅ **Level Progress** - Progress across Easy/Medium/Hard
- ✅ **Achievement Tracking** - Special achievements unlocked

## 📊 **How It Works**

### **For You (Player):**
1. **Play on phone** → **Scores sync to computer**
2. **Achieve high score** → **Shows on all devices**
3. **Switch devices** → **All progress preserved**
4. **Compete with yourself** → **Track improvement over time**

### **For Her (Viewer):**
1. **See your progress** → **Know what you've been playing**
2. **Celebrate achievements** → **Share in your victories**
3. **Track engagement** → **See which games you enjoy most**

## 🔄 **Cross-Device Experience**

- **Phone → Computer**: Play on phone, check scores on laptop
- **Tablet → Phone**: Achieve high score on tablet, see on phone
- **Computer → Phone**: Complete game on computer, stats sync to phone
- **Any device → Any device**: Perfect score synchronization everywhere!

## 🎯 **Features You Get**

### **Real-time Sync**
- ✅ **Instant updates** when scores are achieved
- ✅ **No data loss** when switching devices
- ✅ **Automatic backup** in the cloud

### **Smart Fallback**
- ✅ **Works offline** with localStorage backup
- ✅ **Syncs when online** automatically
- ✅ **No interruption** to gameplay

### **Performance Tracking**
- ✅ **Personal bests** for each game
- ✅ **Progress over time** tracking
- ✅ **Achievement system** for milestones

## 🚀 **Setup Steps**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (ynfolcfzdoabztlybgzr)
3. **Go to SQL Editor**
4. **Run both SQL commands** above
5. **Test the games** to see scores syncing!

## 🧪 **Testing the Scoreboard**

### **Test Love Spin Wheel:**
1. **Spin the wheel** on one device
2. **Check spin count** increases
3. **Switch to another device**
4. **Verify spin count** is synced

### **Test Memory Match:**
1. **Complete a game** on one device
2. **Check best score** is saved
3. **Switch to another device**
4. **Verify best score** appears

## 🎉 **Your Games Are Now Connected!**

**Every game score** now syncs across all devices, **every achievement** is preserved, and **every victory** is shared instantly! 🏆

---

**Need help?** Check the main `SETUP-SUPABASE.md` file for database setup instructions! 