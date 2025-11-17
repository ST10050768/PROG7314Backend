const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../client/SupabaseClient');
jest.mock('../client/firebase-admin', () => {
  const send = jest.fn().mockResolvedValue('mocked-message-id');
  const messaging = jest.fn(() => ({ send }));

  return {
    apps: [],
    auth: jest.fn(),
    credential: { cert: jest.fn() },
    initializeApp: jest.fn(),
    messaging,
  };
});

const supabase = require('../client/SupabaseClient');
const admin = require('../client/firebase-admin');
const {
  createThread,
  getMessages,
  sendMessage,
  markMessageSeen,
} = require('../controllers/MessageController');

const app = express();
app.use(bodyParser.json());
app.post('/threads', createThread);
app.get('/threads/:threadId/messages', getMessages);
app.post('/messages', sendMessage);
app.patch('/messages/:messageId/seen', markMessageSeen);

describe('MessageController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createThread', () => {
    it('should reuse existing thread', async () => {
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: 123 },
          error: null,
        }),
      });

      const res = await request(app).post('/threads').send({
        customerId: 'cust1',
        providerId: 'prov1',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 123 });
    });

    it('should create new thread if none exists', async () => {
      supabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        })
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 456 },
            error: null,
          }),
        });

      const res = await request(app).post('/threads').send({
        customerId: 'cust1',
        providerId: 'prov1',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 456 });
    });
  });

  describe('getMessages', () => {
    it('should return messages for a thread', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [{ id: 1, content: 'Hello' }],
          error: null,
        }),
      });

      const res = await request(app).get('/threads/123/messages');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id: 1, content: 'Hello' }]);
    });
  });

  describe('sendMessage', () => {
    it('should send message and push notification', async () => {
      supabase.from
        .mockImplementationOnce(() => ({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 1, content: 'Hi' },
            error: null,
          }),
        }))
        .mockImplementationOnce(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 'thread1', CustomerID: 'cust1', ProviderID: 'prov1' },
            error: null,
          }),
        }))
        .mockImplementationOnce(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { ProfileUrl: 'url' } }),
        }))
        .mockImplementationOnce(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { FullName: 'Provider X' } }),
        }))
        .mockImplementationOnce(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { FullName: 'Customer Y' } }),
        }))
        .mockImplementationOnce(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          mockResolvedValue: jest.fn().mockResolvedValue({
            data: [{ Token: 'fcm-token' }],
            error: null,
          }),
        }));

      const res = await request(app).post('/messages').send({
        threadId: 'thread1',
        senderType: 'Provider',
        senderId: 'prov1',
        content: 'Hi there',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 1, content: 'Hi' });
    });
  });

  describe('markMessageSeen', () => {
    it('should mark message as seen', async () => {
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 1, Seen: true },
          error: null,
        }),
      });

      const res = await request(app).patch('/messages/1/seen');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 1, Seen: true });
    });
  });
});