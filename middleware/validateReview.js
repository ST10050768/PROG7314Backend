module.exports = (req, res, next) => {
  const { customerId, serviceId, rating } = req.body;
  if (!customerId || !serviceId) {
    return res.status(400).json({ error: "CustomerID and ServiceID are required." });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }
  next();
};