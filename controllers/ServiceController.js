const supabase = require('../client/SupabaseClient');

exports.getServicesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log('Fetching services for category:', categoryId);

  const { data, error } = await supabase
    .from('Services')
    .select('*')
    .eq('CategoryID', categoryId);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

exports.getServiceById = async (req, res) => {
  const { id } = req.params;

  // Fetch service
  const { data: service, error: serviceError } = await supabase
    .from('Services')
    .select('*')
    .eq('id', id)
    .single();

  if (serviceError || !service) {
    return res.status(500).json({ error: serviceError?.message || 'Service not found' });
  }

  // Fetch provider name
  const { data: provider, error: providerError } = await supabase
    .from('Provider')
    .select('FullName')
    .eq('id', service.ProviderID)
    .single();

  // Fetch tiers
  const { data: tiers, error: tiersError } = await supabase
    .from('Tiers')
    .select('id, Type, Price, Description')
    .eq('ServiceID', id);

  res.json({
    ...service,
    providerName: provider?.FullName || 'Unknown',
    tiers: tiers || []
  });
};