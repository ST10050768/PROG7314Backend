const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock Supabase
jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');

// Controller
const { getAllCategories } = require('../controllers/CategoryController');

// Setup Express test app
const app = express();
app.use(bodyParser.json());
app.get('/categories', getAllCategories);

describe('GET /categories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all categories', async () => {
    const mockData = [
      { id: 1, name: 'Design' },
      { id: 2, name: 'Development' },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('should return 500 if Supabase returns an error', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Select failed' },
      }),
    });

    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Select failed' });
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
const { getAllCategories } = require('../controllers/CategoryController');

// Setup Express test app
const app = express();
app.use(bodyParser.json());
app.get('/categories', getAllCategories);

describe('GET /categories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all categories', async () => {
    const mockData = [
      { id: 1, name: 'Design' },
      { id: 2, name: 'Development' },
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('should return 500 if Supabase returns an error', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Select failed' },
      }),
    });

    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Select failed' });
  });
}); */