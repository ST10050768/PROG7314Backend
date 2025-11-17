const supabase = require('../client/SupabaseClient');

exports.getAllCategories = async (req, res) => {
  const { data, error } = await supabase
    .from('Category')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};