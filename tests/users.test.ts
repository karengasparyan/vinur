import request = require('supertest');
import app from '../src';
import { authorization } from '../src/config/testSetup';
import { faker } from '@faker-js/faker';

describe('API Users Tests', () => {
  let token: string;

  beforeAll(async () => {
    token = await authorization();
  });

  it('should return current user data', async () => {
    const response = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User data');
  });

  it('should update current user name', async () => {
    const response = await request(app)
      .put('/api/users')
      .send({
        name: faker.internet.userName()
      })
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Update successfully');
  });

  it('should return users report', async () => {
    const response = await request(app).get('/api/users/report').set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Report data');
  });

  it('should update current users password', async () => {
    const response = await request(app)
      .put('/api/users/change-password')
      .send({
        password: 'As12#sd45',
        oldPassword: 'As12#sd45'
      })
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Password change successfully');
  });
});
