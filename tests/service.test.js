const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock Supabase
jest.mock('../client/SupabaseClient');
const supabase = require('../client/SupabaseClient');

// Controllers
const {
  getServicesByCategory,
  getServiceById,
} = require('../controllers/ServiceController');

// Setup Express test app
const app = express();
app.use(bodyParser.json());
app.get('/services/category/:categoryId', getServicesByCategory);
app.get('/services/:id', getServiceById);

describe('Service endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return services by category', async () => {
    const mockServices = [{ id: 1, name: 'Logo Design' }];
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: mockServices, error: null }),
      })),
    });

    const res = await request(app).get('/services/category/5');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockServices);
  });

  it('should return 500 if category fetch fails', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Category fetch failed' },
        }),
      })),
    });

    const res = await request(app).get('/services/category/5');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Category fetch failed' });
  });

  it('should return full service details by ID', async () => {
    const serviceMock = { id: 1, name: 'Web Dev', ProviderID: 99 };
    const providerMock = { FullName: 'Alwande Ngcobo' };
    const tiersMock = [{ id: 1, Type: 'Basic', Price: 100 }];

    const selectMock = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: serviceMock, error: null }),
      })),
    }));

    const providerSelectMock = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: providerMock, error: null }),
      })),
    }));

    const tiersSelectMock = jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ data: tiersMock, error: null }),
    }));

    supabase.from
      .mockImplementationOnce(() => ({ select: selectMock })) // service
      .mockImplementationOnce(() => ({ select: providerSelectMock })) // provider
      .mockImplementationOnce(() => ({ select: tiersSelectMock })); // tiers

    const res = await request(app).get('/services/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      ...serviceMock,
      providerName: 'Alwande Ngcobo',
      tiers: tiersMock,
    });
  });

  it('should return 500 if service not found', async () => {
    const selectMock = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      })),
    }));

    supabase.from.mockImplementationOnce(() => ({ select: selectMock }));

    const res = await request(app).get('/services/999');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Service not found' });
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

// Controllers
const {
  getServicesByCategory,
  getServiceById,
} = require('../controllers/ServiceController');

// Setup Express test app
const app = express();
app.use(bodyParser.json());
app.get('/services/category/:categoryId', getServicesByCategory);
app.get('/services/:id', getServiceById);

describe('Service endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return services by category', async () => {
    const mockServices = [{ id: 1, name: 'Logo Design' }];
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: mockServices, error: null }),
      })),
    });

    const res = await request(app).get('/services/category/5');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockServices);
  });

  it('should return 500 if category fetch fails', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Category fetch failed' },
        }),
      })),
    });

    const res = await request(app).get('/services/category/5');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Category fetch failed' });
  });

  it('should return full service details by ID', async () => {
    const serviceMock = { id: 1, name: 'Web Dev', ProviderID: 99 };
    const providerMock = { FullName: 'Alwande Ngcobo' };
    const tiersMock = [{ id: 1, Type: 'Basic', Price: 100 }];

    const selectMock = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: serviceMock, error: null }),
      })),
    }));

    const providerSelectMock = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: providerMock, error: null }),
      })),
    }));

    const tiersSelectMock = jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ data: tiersMock, error: null }),
    }));

    supabase.from
      .mockImplementationOnce(() => ({ select: selectMock })) // service
      .mockImplementationOnce(() => ({ select: providerSelectMock })) // provider
      .mockImplementationOnce(() => ({ select: tiersSelectMock })); // tiers

    const res = await request(app).get('/services/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      ...serviceMock,
      providerName: 'Alwande Ngcobo',
      tiers: tiersMock,
    });
  });

  it('should return 500 if service not found', async () => {
    const selectMock = jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      })),
    }));

    supabase.from.mockImplementationOnce(() => ({ select: selectMock }));

    const res = await request(app).get('/services/999');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Service not found' });
  });
}); */