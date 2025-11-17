const supabase = require('../client/SupabaseClient');

const initiateMockPayment = async (req, res) => {
  const { amount, firebaseUid, tiersId, email } = req.body;

  if (!amount || !firebaseUid || !tiersId || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Resolve Customer.id from Firebase UID
    const { data: customerData, error: customerError } = await supabase
      .from('Customer')
      .select('id')
      .eq('Firebase_uiid', firebaseUid)
      .single();

    if (customerError || !customerData) {
      console.error('Failed to find customer:', customerError?.message);
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerId = customerData.id;

    // Build mock payment URL
    const fakePaymentUrl = `http://localhost:5000/api/payments/mock-success?customerId=${customerId}&tiersId=${tiersId}`;

    console.log('Mock payment URL:', fakePaymentUrl);
    res.json({ paymentUrl: fakePaymentUrl });
  } catch (err) {
    console.error('Error resolving customer:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { initiateMockPayment };
