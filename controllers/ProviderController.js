const supabase = require('../client/SupabaseClient');

// Get all providers
exports.getProviders = async (req, res) => {
  const { data, error } = await supabase
    .from('Provider')
    .select('id, FullName, ProfileUrl, Email, created_at');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Get single provider by ID
exports.getProviderById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('Provider')
    .select('id, FullName, ProfileUrl, Email, created_at')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};