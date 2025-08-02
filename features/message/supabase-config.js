// Supabase Configuration for Love Messages
// Your Supabase credentials

const SUPABASE_URL = 'https://ynfolcfzdoabztlybgzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZm9sY2Z6ZG9hYnp0bHliZ3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDM3MzcsImV4cCI6MjA2OTY3OTczN30.ZtO9gzLG0l47LtKhTuagCpNOwzmV9bPJ4DLdmxq8LRc';

// Check if Supabase is configured
const isSupabaseConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (only if configured)
let supabaseClient = null;
if (isSupabaseConfigured && typeof window.supabase !== 'undefined') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Message functions
const MessageService = {
  // Get all messages
  async getAllMessages() {
    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      return JSON.parse(localStorage.getItem('allLoveMessages') || '[]');
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('love_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('allLoveMessages') || '[]');
    }
  },

  // Add new message
  async addMessage(message) {
    console.log('MessageService.addMessage called with:', message);
    
    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      console.log('Using localStorage fallback for message');
      const allMessages = JSON.parse(localStorage.getItem('allLoveMessages') || '[]');
      const newMessage = {
        ...message,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      allMessages.unshift(newMessage);
      localStorage.setItem('allLoveMessages', JSON.stringify(allMessages));
      return newMessage;
    }
    
    try {
      console.log('Attempting to save message to Supabase...');
      const { data, error } = await supabaseClient
        .from('love_messages')
        .insert([{
          title: message.title,
          content: message.content,
          style: message.style,
          effects: message.effects,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Message saved to Supabase successfully:', data);
      return data[0];
    } catch (error) {
      console.error('Error adding message to Supabase:', error);
      
      // Fallback to localStorage
      console.log('Falling back to localStorage...');
      const allMessages = JSON.parse(localStorage.getItem('allLoveMessages') || '[]');
      const newMessage = {
        ...message,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      allMessages.unshift(newMessage);
      localStorage.setItem('allLoveMessages', JSON.stringify(allMessages));
      return newMessage;
    }
  },

  // Get messages since last visit
  async getNewMessages(lastVisitTime) {
    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      const allMessages = JSON.parse(localStorage.getItem('allLoveMessages') || '[]');
      return allMessages.filter(message => 
        new Date(message.created_at) > new Date(lastVisitTime)
      );
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('love_messages')
        .select('*')
        .gt('created_at', lastVisitTime)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching new messages:', error);
      // Fallback to localStorage
      const allMessages = JSON.parse(localStorage.getItem('allLoveMessages') || '[]');
      return allMessages.filter(message => 
        new Date(message.created_at) > new Date(lastVisitTime)
      );
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabaseClient, MessageService };
}

// 🏆 Scoreboard Service for Game Scores
const ScoreboardService = {
  // Get all scores for a game
  async getGameScores(gameName) {
    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      return JSON.parse(localStorage.getItem(`scores_${gameName}`) || '[]');
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('game_scores')
        .select('*')
        .eq('game_name', gameName)
        .order('score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scores:', error);
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem(`scores_${gameName}`) || '[]');
    }
  },

  // Save a new score
  async saveScore(gameName, score, details = {}) {
    const scoreData = {
      game_name: gameName,
      score: score,
      details: details,
      created_at: new Date().toISOString()
    };

    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      const scores = JSON.parse(localStorage.getItem(`scores_${gameName}`) || '[]');
      scores.push(scoreData);
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem(`scores_${gameName}`, JSON.stringify(scores));
      return scoreData;
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('game_scores')
        .insert([scoreData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving score:', error);
      // Fallback to localStorage
      const scores = JSON.parse(localStorage.getItem(`scores_${gameName}`) || '[]');
      scores.push(scoreData);
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem(`scores_${gameName}`, JSON.stringify(scores));
      return scoreData;
    }
  },

  // Get best score for a game
  async getBestScore(gameName) {
    const scores = await this.getGameScores(gameName);
    return scores.length > 0 ? scores[0] : null;
  },

  // Update game stats (like spin count, moves, etc.)
  async updateGameStats(gameName, stats) {
    const statsData = {
      game_name: gameName,
      stats: stats,
      updated_at: new Date().toISOString()
    };

    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      localStorage.setItem(`stats_${gameName}`, JSON.stringify(statsData));
      return statsData;
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('game_stats')
        .upsert([statsData], { onConflict: 'game_name' })
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating stats:', error);
      // Fallback to localStorage
      localStorage.setItem(`stats_${gameName}`, JSON.stringify(statsData));
      return statsData;
    }
  },

  // Get game stats
  async getGameStats(gameName) {
    // Fallback to localStorage if Supabase not configured
    if (!isSupabaseConfigured || !supabaseClient) {
      return JSON.parse(localStorage.getItem(`stats_${gameName}`) || 'null');
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('game_stats')
        .select('*')
        .eq('game_name', gameName)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem(`stats_${gameName}`) || 'null');
    }
  }
};

// Export ScoreboardService
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabaseClient, MessageService, ScoreboardService };
} 