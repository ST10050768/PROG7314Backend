const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');
const {
  createReview,
  getReviewsByService,
} = require('../controllers/ReviewController');

const app = express();
app.use(bodyParser.json());
app.post('/reviews', createReview);
app.get('/reviews/:id', getReviewsByService);

describe('ReviewController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [{ id: 1, Rating: 5, Comment: 'Great service!' }],
          error: null,
        }),
      });

      const res = await request(app).post('/reviews').send({
        customerId: 'cust1',
        serviceId: 'serv1',
        rating: 5,
        comment: 'Great service!',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ id: 1, Rating: 5, Comment: 'Great service!' });
    });

    it('should return 400 if insert fails', async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Insert failed' },
        }),
      });

      const res = await request(app).post('/reviews').send({
        customerId: 'cust1',
        serviceId: 'serv1',
        rating: 3,
        comment: 'Okay',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Insert failed' });
    });
  });

  describe('getReviewsByService', () => {
    it('should return reviews for a service', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [
            { id: 1, Rating: 5, Comment: 'Excellent' },
            { id: 2, Rating: 4, Comment: 'Good' },
          ],
          error: null,
        }),
      });

      const res = await request(app).get('/reviews/serv1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { id: 1, Rating: 5, Comment: 'Excellent' },
        { id: 2, Rating: 4, Comment: 'Good' },
      ]);
    });

    it('should return 400 if fetch fails', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Fetch failed' },
        }),
      });

      const res = await request(app).get('/reviews/serv1');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Fetch failed' });
    });
  });
});