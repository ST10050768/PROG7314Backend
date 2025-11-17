const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');
const {
  getProviders,
  getProviderById,
} = require('../controllers/ProviderController');

const app = express();
app.use(bodyParser.json());
app.get('/providers', getProviders);
app.get('/providers/:id', getProviderById);

describe('ProviderController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProviders', () => {
    it('should return all providers', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [
            { id: 1, FullName: 'Provider One', Email: 'one@example.com' },
            { id: 2, FullName: 'Provider Two', Email: 'two@example.com' },
          ],
          error: null,
        }),
      });

      const res = await request(app).get('/providers');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { id: 1, FullName: 'Provider One', Email: 'one@example.com' },
        { id: 2, FullName: 'Provider Two', Email: 'two@example.com' },
      ]);
    });

    it('should return 400 if fetch fails', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Fetch failed' },
        }),
      });

      const res = await request(app).get('/providers');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Fetch failed' });
    });
  });

  describe('getProviderById', () => {
    it('should return provider by ID', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 1, FullName: 'Provider One', Email: 'one@example.com' },
          error: null,
        }),
      });

      const res = await request(app).get('/providers/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        FullName: 'Provider One',
        Email: 'one@example.com',
      });
    });

    it('should return 400 if lookup fails', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Lookup failed' },
        }),
      });

      const res = await request(app).get('/providers/1');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Lookup failed' });
    });
  });
});