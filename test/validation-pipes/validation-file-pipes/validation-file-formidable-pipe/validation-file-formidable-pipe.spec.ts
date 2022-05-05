import express, { Router } from 'express';
import request from 'supertest';
// import

const app = express();

app.post('/post', (req, res, next) => {});

describe('Validation file formidable pipe', () => {
    it('should do something', async () => {

        const res = await request(app).post('/post').field('first_name', 'asd').attach('file', Buffer.from('test data'));

    });
});
