const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generateUniqueLink = () => {
  return `flk_${crypto.randomBytes(16).toString('hex')}`;
};

const calculateExpiry = (validityType, untilOpened = false) => {
  if (untilOpened) return null;
  const now = new Date();
  switch (validityType) {
    case '3_days':
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
};

// Create message
const createMessage = async (req, res) => {
  try {
    const {
      recipient_label,
      message_text,
      message_type,
      category,
      reply_allowed,
      sender_identity_visible,
      view_limit,
      link_validity_type,
      until_opened
    } = req.body;

    const creator_id = req.user.id;
    const unique_link = generateUniqueLink();
    const expires_at = calculateExpiry(link_validity_type, until_opened);

    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert([{
        creator_user_id: creator_id,
        recipient_label,
        message_text,
        message_type,
        category,
        reply_allowed: reply_allowed === 'true',
        sender_identity_visible: sender_identity_visible === 'true',
        view_limit: parseInt(view_limit),
        views_used: 0,
        link_validity_type,
        unique_link,
        expires_at,
        until_opened: until_opened === 'true',
        status: 'active'
      }])
      .select()
      .single();

    if (messageError) {
      return res.status(400).json({ error: messageError.message });
    }

    res.json({
      success: true,
      message: message,
      recipient_url: `${process.env.FRONTEND_URL}/message/${unique_link}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user messages
const getUserMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const userId = req.user.id;

    let query = supabase
      .from('messages')
      .select(`
        *,
        face_references(*),
        replies(*),
        verification_logs(count)
      `)
      .eq('creator_user_id', userId)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`recipient_label.ilike.%${search}%,message_text.ilike.%${search}%`);
    }

    const { data: messages, error } = await query.range((page - 1) * limit, page * limit - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      messages,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single message for recipient
const getMessageByLink = async (req, res) => {
  try {
    const { link } = req.params;

    const { data: message, error } = await supabase
      .from('messages')
      .select('*')
      .eq('unique_link', link)
      .eq('status', 'active')
      .single();

    if (error || !message) {
      return res.status(404).json({ error: 'Message not found or expired' });
    }

    // Check expiry
    if (message.expires_at && new Date(message.expires_at) < new Date()) {
      await supabase
        .from('messages')
        .update({ status: 'expired' })
        .eq('id', message.id);

      return res.status(404).json({ error: 'Link expired' });
    }

    // Check view limit
    if (message.view_limit && message.views_used >= message.view_limit) {
      return res.status(403).json({ error: 'View limit reached' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update message view count
const incrementViewCount = async (req, res) => {
  try {
    const { link } = req.params;

    const { data: message, error } = await supabase
      .from('messages')
      .select('id, views_used, view_limit, first_opened_at')
      .eq('unique_link', link)
      .single();

    if (error || !message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.view_limit && message.views_used >= message.view_limit) {
      return res.status(403).json({ error: 'View limit reached' });
    }

    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update({
        views_used: message.views_used + 1,
        first_opened_at: message.first_opened_at || new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      })
      .eq('id', message.id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save reply
const saveReply = async (req, res) => {
  try {
    const { link } = req.params;
    const { reply_text } = req.body;

    const { data: message } = await supabase
      .from('messages')
      .select('id')
      .eq('unique_link', link)
      .single();

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const { data: reply, error } = await supabase
      .from('replies')
      .insert([{
        message_id: message.id,
        reply_text
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await supabase
      .from('messages')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', message.id);

    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload face reference (without sharp)
const uploadFaceReference = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { message_id, face_slot_type } = req.body;
    const creator_id = req.user.id;

    const { data: message } = await supabase
      .from('messages')
      .select('id')
      .eq('id', message_id)
      .eq('creator_user_id', creator_id)
      .single();

    if (!message) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const buffer = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from('face-references')
      .upload(fileName, buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('face_references')
      .insert([{
        message_id,
        face_slot_type,
        image_url: fileName,
        blurred_preview_url: null,
        thumbnail_url: null
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, faceReference: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  getUserMessages,
  getMessageByLink,
  incrementViewCount,
  saveReply,
  uploadFaceReference
};