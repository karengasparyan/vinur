module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/config/testSetup.ts'],
  testMatch: ['**/tests/**/*.test.ts', '**/unitTests/**/*.test.ts']
};
