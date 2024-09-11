import { Redis } from '../options/Redis';
import request from 'supertest';
import app from '../index';

export const authorization = async () => {
  await Redis.initialize();

  const response = await request(app)
    .post('/api/auth/sign-in')
    .send({
      email: 'user@example.com',
      password: 'As12#sd45'
    })
    .set('Content-Type', 'application/json');

  return response.body.data.accessToken;
};

export const globalTeardown = async () => {
  await Redis.disconnect();
};
