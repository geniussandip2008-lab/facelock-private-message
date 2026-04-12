const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/admin/analytics
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      { count: totalCreators },
      { count: totalMessages },
      { count: totalReplies },
      { count: totalVerificationLogs },
      { data: recentActivity }
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }),
      supabase.from('replies').select('id', { count: 'exact', head: true }),
      supabase
        .from('verification_logs')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('messages')
        .select('id, recipient_label, created_at, status')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    const analytics = {
      totalCreators,
      totalMessages,
      totalReplies,
      totalVerificationLogs,
      activeMessages: recentActivity.filter(m => m.status === 'active').length,
      suspiciousActivity: totalVerificationLogs * 0.05, // Placeholder calculation
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/online-users
router.get('/online-users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Placeholder for real-time online users (would use Supabase realtime or Redis)
    const onlineUsers = Math.floor(Math.random() * 50) + 10;
    const activeUsers24h = Math.floor(Math.random() * 200) + 50;

    res.json({
      success: true,
      data: {
        onlineUsers,
        activeUsers24h,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/recent-activity
router.get('/recent-activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: recentMessages, error: msgError } = await supabase
      .from('messages')
      .select(`
        id,
        recipient_label,
        creator_user_id,
        status,
        views_used,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: recentReplies, error: replyError } = await supabase
      .from('replies')
      .select(`
        id,
        message_id,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (msgError || replyError) {
      throw new Error('Database query failed');
    }

    res.json({
      success: true,
      data: {
        recentMessages: recentMessages || [],
        recentReplies: recentReplies || [],
        totalRecent: ((recentMessages && recentMessages.length) || 0) + ((recentReplies && recentReplies.length) || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users-count
router.get('/users-count', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      { count: totalUsers },
      { count: adminUsers },
      { count: creatorUsers },
      { count: activeUsers }
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'creator'),
      supabase
        .from('users')
        .select('id', { 
          count: 'exact', 
          head: true 
        })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        adminUsers,
        creatorUsers,
        activeUsers30d: activeUsers,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;