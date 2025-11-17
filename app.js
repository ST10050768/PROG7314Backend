require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const deviceTokenRoutes = require('./routes/deviceTokenRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const providerRoutes = require('./routes/providerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const supabase = require('./client/SupabaseClient');
const path = require('path');




const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', deviceTokenRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/notify', notificationRoutes);
app.get('/api/payments/mock-success', async (req, res) => {
  const { customerId, tiersId } = req.query;

  try {
    const { data, error } = await supabase
      .from('Booking')
      .insert([
        {
          CustomerID: parseInt(customerId),
          TiersID: parseInt(tiersId),
          Date: new Date().toISOString()
        }
      ])
      .select('id');

    if (error) throw error;

    console.log(`✅ Booking stored: ID ${data[0].id}`);
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Payment Success</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f9f9f9;
        text-align: center;
        padding: 60px;
        color: #333;
      }
      .container {
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 500px;
        margin: auto;
      }
      .checkmark {
        font-size: 64px;
        color: #4CAF50;
      }
      h1 {
        margin-top: 20px;
        font-size: 28px;
      }
      p {
        font-size: 16px;
        margin: 12px 0;
      }
      .booking-id {
        font-weight: bold;
        color: #6A1B9A;
      }
      .button {
        margin-top: 30px;
        padding: 12px 24px;
        background-color: #6A1B9A;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        text-decoration: none;
      }
      .button:hover {
        background-color: #4e1270;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="checkmark">✅</div>
      <h1>Payment Successful</h1>
      <p>Thank you for your booking!</p>
      <p>Your booking ID is: <span class="booking-id">${data[0].id}</span></p>
      <a href="https://your-app-url.com" class="button">Return to Dashboard</a>
    </div>
  </body>
  </html>
`);
  } catch (err) {
    console.error('❌ Supabase insert failed:', err.message);
    res.status(500).send('Booking failed');
  }
});





app.get('/', (req, res) => {
  res.send('Express backend is live');
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});



module.exports = app;