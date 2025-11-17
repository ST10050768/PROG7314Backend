const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');

const { initiateMockPayment } = require('../controllers/PaymentController');

const app = express();
app.use(bodyParser.json());
app.post('/payments/initiate', initiateMockPayment);

describe('POST /payments/initiate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      // email missing
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 404 if customer not found', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    });

    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Customer not found' });
  });

  it('should return 500 if Supabase throws error', async () => {
    supabase.from.mockImplementation(() => {
      throw new Error('Supabase failure');
    });

    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

  it('should return mock payment URL if customer is found', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { id: 42 },
            error: null,
          }),
        })),
      })),
    });

    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.paymentUrl).toMatch(/customerId=42&tiersId=1/);
  });
});

/* Code Attribution
Code from Copilot
Link:https://copilot.microsoft.com/shares/ozgu6M5kn8nzhgQPhzZwo
Accessed: 6 October 2025
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');

const { initiateMockPayment } = require('../controllers/PaymentController');

const app = express();
app.use(bodyParser.json());
app.post('/payments/initiate', initiateMockPayment);

describe('POST /payments/initiate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      // email missing
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 404 if customer not found', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    });

    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Customer not found' });
  });

  it('should return 500 if Supabase throws error', async () => {
    supabase.from.mockImplementation(() => {
      throw new Error('Supabase failure');
    });

    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

  it('should return mock payment URL if customer is found', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { id: 42 },
            error: null,
          }),
        })),
      })),
    });

    const res = await request(app).post('/payments/initiate').send({
      amount: 100,
      firebaseUid: 'abc123',
      tiersId: 1,
      email: 'test@example.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.paymentUrl).toMatch(/customerId=42&tiersId=1/);
  });
}); */