const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');
const {
  registerToken,
  removeToken,
} = require('../controllers/DeviceTokenController');

const app = express();
app.use(bodyParser.json());
app.post('/token/register', registerToken);
app.post('/token/remove', removeToken);

describe('DeviceTokenController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerToken', () => {
    it('should return 400 if userId or token is missing', async () => {
      const res = await request(app).post('/token/register').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'userId and token are required' });
    });

    it('should register token successfully', async () => {
      supabase.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [{ id: 1, UserID: 'abc123', Token: 'fcm-token' }],
            error: null,
          }),
        }),
      });

      const res = await request(app).post('/token/register').send({
        userId: 'abc123',
        token: 'fcm-token',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        token: [{ id: 1, UserID: 'abc123', Token: 'fcm-token' }],
      });
    });

    it('should return 400 if upsert fails', async () => {
      supabase.from.mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Upsert failed' },
          }),
        }),
      });

      const res = await request(app).post('/token/register').send({
        userId: 'abc123',
        token: 'fcm-token',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Upsert failed' });
    });
  });

  describe('removeToken', () => {
    it('should return 400 if token is missing', async () => {
      const res = await request(app).post('/token/remove').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'token is required' });
    });

    it('should remove token successfully', async () => {
      supabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      const res = await request(app).post('/token/remove').send({
        token: 'fcm-token',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
    });

    it('should return 400 if delete fails', async () => {
      supabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: { message: 'Delete failed' },
          }),
        }),
      });

      const res = await request(app).post('/token/remove').send({
        token: 'fcm-token',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Delete failed' });
    });
  });
});