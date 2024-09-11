import { Redis } from '../options/Redis';
import request from 'supertest';
import app from '../index';

export const authorization = async () => {
  const response = await request(app)
    .post('/api/auth/sign-in')
    .send({
      email: 'test@example.com',
      password: 'As12#sd45'
    })
    .set('Content-Type', 'application/json');

  return response.body.data.accessToken;
};

export const globalTeardown = async () => {
  await Redis.disconnect();
};
