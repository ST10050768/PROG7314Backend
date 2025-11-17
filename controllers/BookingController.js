const supabase = require('../client/SupabaseClient');

exports.createBooking = async (req, res) => {
  const { customerId, tiersId, date } = req.body;

  if (!customerId || !tiersId) {
    return res.status(400).json({ error: 'Missing customerId or tiersId' });
  }

  const { data, error } = await supabase
    .from('Booking')
    .insert([
      {
        CustomerID: customerId,
        TiersID: tiersId,
        Date: date || null
      }
    ]);

  if (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true, booking: data[0] });
};