import request from 'supertest';
import app from '@/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Users API - DB Integration tests', () => {
  beforeEach(async () => {
    await prisma.$transaction([prisma.event.deleteMany(), prisma.user.deleteMany()]);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$transaction([prisma.event.deleteMany(), prisma.user.deleteMany()]);
    await prisma.$disconnect();
  });

  it('should create a new user', async () => {
    const res = await request(app).post('/users').send({ email: 'test@example.com' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.consents).toEqual([]);
  });

  it('should not create a user with invalid email', async () => {
    const res = await request(app).post('/users').send({ email: 'invalid-email' });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('data');
  });

  it('should not create a user with an existing email', async () => {
    await prisma.user.create({ data: { email: 'existing@example.com' } });

    const res = await request(app).post('/users').send({ email: 'existing@example.com' });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Email already exists');
  });

  it('should get all users', async () => {
    await prisma.user.create({ data: { email: 'user1@example.com' } });
    await prisma.user.create({ data: { email: 'user2@example.com' } });

    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('consents');
  });

  it('should get a user with consents applied', async () => {
    const user = await prisma.user.create({ data: { email: 'consentuser@example.com' } });

    await request(app)
      .post('/events')
      .send({
        user: { id: user.id },
        consents: [{ id: 'email_notifications', enabled: true }],
      });

    await request(app)
      .post('/events')
      .send({
        user: { id: user.id },
        consents: [
          { id: 'email_notifications', enabled: false },
          { id: 'sms_notifications', enabled: true },
        ],
      });

    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    const fetchedUser = res.body.find((u: any) => u.id === user.id);

    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.consents).toEqual([
      { id: 'email_notifications', enabled: false },
      { id: 'sms_notifications', enabled: true },
    ]);
  });

  it('should delete a user', async () => {
    const user = await prisma.user.create({ data: { email: 'delete@example.com' } });
    const res = await request(app).delete(`/users/${user.id}`);
    expect(res.statusCode).toEqual(204);

    const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });

  it('should return 404 when deleting a non-existent user', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).delete(`/users/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should get a user by ID', async () => {
    const user = await prisma.user.create({ data: { email: 'user-by-id@example.com' } });

    const res = await request(app).get(`/users/${user.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', user.id);
    expect(res.body).toHaveProperty('email', user.email);
    expect(res.body).toHaveProperty('consents', user.consents);
  });

  it('should return 404 when getting a non-existent user by ID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/users/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('User not found');
  });
});
