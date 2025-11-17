const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');
const { refreshToken } = require('../controllers/NotificationController');

const app = express();
app.use(bodyParser.json());
app.post('/notify/refresh-token', refreshToken);

describe('refreshToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if UserID or Token is missing', async () => {
    const res = await request(app).post('/notify/refresh-token').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'UserID and Token are required' });
  });

  it('should refresh token successfully', async () => {
    supabase.from.mockReturnValue({
      upsert: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
    });

    const res = await request(app).post('/notify/refresh-token').send({
      UserID: 'abc123',
      Token: 'fcm-token-xyz',
    });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('');
  });

  it('should return 500 if upsert fails', async () => {
    supabase.from.mockReturnValue({
      upsert: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Upsert failed' },
      }),
    });

    const res = await request(app).post('/notify/refresh-token').send({
      UserID: 'abc123',
      Token: 'fcm-token-xyz',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Upsert failed' });
  });
});