import request from 'supertest';
import app from '@/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Events API - DB Integration tests', () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({ data: { email: `eventtest-${Date.now()}@example.com` } });
    userId = user.id;
    await prisma.$disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        user: { id: userId },
        consents: [{ id: 'email_notifications', enabled: true }],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.user.id).toBe(userId); // Changed from res.body.user.id
    expect(res.body.consents).toEqual([{ id: 'email_notifications', enabled: true }]);
  });

  it('should not create an event for a non-existent user', async () => {
    const nonExistentUserId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .post('/events')
      .send({
        user: { id: nonExistentUserId },
        consents: [{ id: 'email_notifications', enabled: true }],
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should not create an event with invalid consent ID', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        user: { id: userId },
        consents: [{ id: 'invalid_notification', enabled: true }],
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('data');
  });

  it('should not create an event with invalid consents format', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        user: { id: userId },
        consents: 'not an array',
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('data');
  });

  it('should not create an event with duplicate consent IDs', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        user: { id: userId },
        consents: [
          { id: 'email_notifications', enabled: true },
          { id: 'email_notifications', enabled: false },
        ],
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body.data[0].message).toContain('Duplicate consent ID found: email_notifications');
  });

  it('should handle internal server error during event creation or user update', async () => {
    jest.spyOn(require('@prisma/client').PrismaClient.prototype, '$transaction').mockImplementationOnce(() => {
      throw new Error('Simulated transaction failure');
    });

    const res = await request(app)
      .post('/events')
      .send({
        user: { id: userId },
        consents: [{ id: 'email_notifications', enabled: true }],
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Failed to create event and update user consents due to an internal server error.');
  });
});
