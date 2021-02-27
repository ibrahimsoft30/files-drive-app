/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../src/app');
const { clearData, user } = require('../fixtuers/utils');

beforeAll(clearData);
test('Should uplode file', async () => {
    const response = await request(app)
    .post('/files')
    .set('Authorization', user.tokens[0].token)
    .attach('files', 'tests/fixtuers/img/img.jpg')
    .expect(201);
});

test('Should get all user files', async () => {
    await request(app)
    .get('/files')
    .set('Authorization', user.tokens[0].token)
    .expect(200);
});
