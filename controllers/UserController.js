const supabase = require('../client/SupabaseClient');
const admin = require('firebase-admin');

exports.syncFirebaseUser = async (req, res) => {
  const { uid, email, name } = req.user;

  console.log('Incoming user:', { uid, email, name });

  const { data, error } = await supabase
    .from('Customer')
    .upsert([
      {
        Firebase_uiid: uid,
        email,
        "Full Name": name
      }
    ], { onConflict: ['Firebase_uiid'] });

  console.log('Supabase response:', { data, error });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'User synced', data });
};

exports.deleteCustomerAccount = async (req, res) => {
  try {
    const { uid } = req.user;

    // Find Customer
    const { data: customer, error: findError } = await supabase
      .from('Customer')
      .select('id')
      .eq('Firebase_uiid', uid)
      .single();

    if (findError || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerId = customer.id;

    // Delete related data
    const deleteBookings = await supabase
      .from('Booking')
      .delete()
      .eq('CustomerID', customerId);

    const deletePayments = await supabase
      .from('PaymentMethods')
      .delete()
      .eq('UserId', customerId);

    // Delete Customer row
    const deleteCustomer = await supabase
      .from('Customer')
      .delete()
      .eq('id', customerId);

    // Delete Firebase account
    await admin.auth().deleteUser(uid);

    res.status(200).json({ ok: true, message: 'Account and all data deleted' });
  } catch (e) {
    console.error('[DELETE /users/me] error', e);
    res.status(500).json({ error: 'Failed to delete account and data' });
  }
};

