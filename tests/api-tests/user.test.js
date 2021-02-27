/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../../src/app');
const { clearData, user, user2, wrongUser } = require('../fixtuers/utils');

beforeAll(clearData);

test('Should signup user ', async () => {
    await request(app)
    .post('/users/signup')
    .field({
        username: user2.username,
        password: user2.password,
        email: user2.email
    })
    .attach('image','tests/fixtuers/img/img.jpg')
    .expect(201);
});

test('Should not signup user without email', async () => {
    await request(app)
    .post('/users/signup')
    .field(wrongUser)
    .expect(400);
});

test('Should login user', async () => {
    await request(app)
    .post('/users/login')
    .send({username: 'ibrahim salim', password: 'ibrahim21316500'})
    .expect(200);
});

test('Should not login user with wrong data', async () => {
    await request(app)
    .post('/users/login')
    .send({username: wrongUser.username, password: wrongUser.password })
    .expect(404);
});

test('Should logout user ', async () => {
    await request(app)
    .post('/users/logout')
    .set('Authorization', `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should verify user email', async () => {
    await request(app)
    .post('/users/verfiy')
    .send({name: user.username, code: user.activationCode})
    .expect(200);
});

test('Should return user profile', async () => {
    await request(app)
    .get('/users/profile/show')
    .set('Authorization', user.tokens[0].token)
    .expect(200);
});

test('Should not return user profile', async () => {
    await request(app)
    .get('/users/profile/show')
    .set('Authorization', user.tokens[0].token)
    .expect(200);
});

test('Should not return user profile before authincating', async () => {
    await request(app)
    .get('/users/profile/show')
    .set('Authorization', '')
    .expect(400);
});


test('Should update user profile', async () => {
    await request(app)
    .patch('/users/profile/update')
    .send({
        username: 'ahmed',
        password: 'ahmed123',
        email: 'ahmed@ahmed.com'
    })
    .set('Authorization', user.tokens[0].token)
    .expect(200);
});

test('Should delete account', async () => {
    await request(app)
    .delete('/users')
    .set('Authorization', user.tokens[0].token)
    .expect(200);
});

