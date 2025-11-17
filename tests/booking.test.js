const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock Supabase
jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');

// Controller
const { createBooking } = require('../controllers/BookingController');

// Setup Express test app
const app = express();
app.use(bodyParser.json());
app.post('/bookings', createBooking);

describe('POST /bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if customerId or tiersId is missing', async () => {
    const res = await request(app).post('/bookings').send({ customerId: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing customerId or tiersId' });
  });

  it('should create a booking and return success', async () => {
    const mockData = [{ id: 123, CustomerID: 1, TiersID: 2, Date: '2025-10-06' }];
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const res = await request(app).post('/bookings').send({
      customerId: 1,
      tiersId: 2,
      date: '2025-10-06',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, booking: mockData[0] });
  });

  it('should return 500 if Supabase returns an error', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      }),
    });

    const res = await request(app).post('/bookings').send({
      customerId: 1,
      tiersId: 2,
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Insert failed' });
  });
});


/* Code Attribution
Code from Copilot
Link:https://copilot.microsoft.com/shares/ozgu6M5kn8nzhgQPhzZwo
Accessed: 6 October 2025
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock Supabase
jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');

// Controller
const { createBooking } = require('../controllers/BookingController');

// Setup Express test app
const app = express();
app.use(bodyParser.json());
app.post('/bookings', createBooking);

describe('POST /bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if customerId or tiersId is missing', async () => {
    const res = await request(app).post('/bookings').send({ customerId: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing customerId or tiersId' });
  });

  it('should create a booking and return success', async () => {
    const mockData = [{ id: 123, CustomerID: 1, TiersID: 2, Date: '2025-10-06' }];
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const res = await request(app).post('/bookings').send({
      customerId: 1,
      tiersId: 2,
      date: '2025-10-06',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, booking: mockData[0] });
  });

  it('should return 500 if Supabase returns an error', async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      }),
    });

    const res = await request(app).post('/bookings').send({
      customerId: 1,
      tiersId: 2,
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Insert failed' });
  });
}); */