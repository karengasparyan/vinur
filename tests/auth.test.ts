import request = require('supertest');
import app from '../src';
import { Redis } from '../src/options/Redis';

describe('API Authorization Tests', () => {
  beforeAll(async () => {
    await Redis.initialize();
  });

  afterAll(() => {
    Redis.disconnect();
  });

  it('should connect to Redis successfully', () => {
    const client = Redis.getClient();
    expect(client).toBeDefined();
  });

  it('should return sign in user data', async () => {
    const response = await request(app)
      .post('/api/auth/sign-in')
      .send({
        email: 'test@example.com',
        password: 'As12#sd45'
      })
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successfully');
  });
});
