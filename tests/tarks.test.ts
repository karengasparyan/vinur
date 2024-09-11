import request = require('supertest');
import app from '../src';
import { authorization } from '../src/config/testSetup';

describe('API Tasks Tests', () => {
  let token: string;

  beforeAll(async () => {
    token = await authorization();
  });

  it('should return tasks list data', async () => {
    const response = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Tasks list');
  });
});
