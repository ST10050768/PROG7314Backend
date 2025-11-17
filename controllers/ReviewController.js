const supabase = require('../client/SupabaseClient');

exports.createReview = async (req, res) => {
  const { customerId, serviceId, rating, comment } = req.body;

  try {
    const { data, error } = await supabase
      .from("Review")
      .insert([
        {
          CustomerID: customerId,
          ServiceID: serviceId,
          Rating: rating,
          Comment: comment,
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReviewsByService = async (req, res) => {
  const serviceId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("Review")
      .select("*")
      .eq("ServiceID", serviceId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};