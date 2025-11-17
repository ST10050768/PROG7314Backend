const supabase = require('../client/SupabaseClient');

// Refresh or register a device token
exports.refreshToken = async (req, res) => {
  const { UserID, Token } = req.body;

  if (!UserID || !Token) {
    console.error('Missing UserID or Token');
    return res.status(400).json({ error: 'UserID and Token are required' });
  }

  console.log('Refreshing token for user:', UserID);

  const { data, error } = await supabase
    .from('DeviceToken')
    .upsert({ UserID, Token }, { onConflict: ['UserID'] });

  if (error) {
    console.error('Token refresh failed:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log('Token refreshed:', Token);
  res.status(200).send();
};

/* Code Attribution
Code by CoPilot
Link: 
Accessed 16 November 2025
const supabase = require('../client/SupabaseClient');

exports.refreshToken = async (req, res) => {
  const { UserID, Token } = req.body;

  if (!UserID || !Token) {
    console.error('❌ Missing UserID or Token');
    return res.status(400).json({ error: 'UserID and Token are required' });
  }

  console.log('📌 Refreshing token for user:', UserID);

  const { data, error } = await supabase
    .from('DeviceToken')
    .upsert({ UserID, Token }, { onConflict: ['UserID'] });

  if (error) {
    console.error('❌ Token refresh failed:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log('✅ Token refreshed:', Token);
  res.status(200).send();
};

*/