const supabase = require('../client/SupabaseClient');

// Register a device token for a user
exports.registerToken = async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ error: 'userId and token are required' });
  }

  // Upsert ensures one token per user (avoids duplicates)
  const { data, error } = await supabase
    .from('DeviceToken')
    .upsert([{ UserID: userId, Token: token }], { onConflict: ['Token'] })
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, token: data });
};

// Remove a device token (optional, e.g. logout)
exports.removeToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'token is required' });
  }

  const { error } = await supabase
    .from('DeviceToken')
    .delete()
    .eq('Token', token);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
};