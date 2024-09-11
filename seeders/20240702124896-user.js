const { v4 } = require('uuid');

const user_id = v4();

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('users', [
        {
          id: user_id,
          name: 'Example',
          email: 'user@example.com',
          //As12#sd45
          password: '0006f25698a7d419138e9653400e3fbdfbc3b019eaae54457d1c4c715b2a3372',
          verified_at: '2024-09-10 19:20:57.0'
        },
        {
          id: user_id,
          name: 'Example1',
          email: 'user1@example.com',
          //As12#sd45
          password: '0006f25698a7d419138e9653400e3fbdfbc3b019eaae54457d1c4c715b2a3372',
          verified_at: '2024-09-10 19:20:57.0'
        },
        {
          id: user_id,
          name: 'Test',
          email: 'test@example.com',
          //As12#sd45
          password: '0006f25698a7d419138e9653400e3fbdfbc3b019eaae54457d1c4c715b2a3372',
          verified_at: '2024-09-10 19:20:57.0'
        }
      ]);

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  down: async (queryInterface) => queryInterface.bulkDelete('users', { email: 'user@example.com' })
};
