import { faker } from '@faker-js/faker';
import { getPagination } from '../src/utils/helps';

describe('Unit tests', () => {
  it('should return data', async () => {
    const data = getPagination(faker.number.int(1), faker.number.int(20));

    expect(data).toHaveProperty(['limit']);
  });
});
