import { createRouteWithPipe } from '../../utils/server-utils';
import request from 'supertest';
import { getTestFilePath } from '../../test-utils/files';
import { validationFilePipe } from '../../../src';
import { MultipleFilesDto, SingleFileDto } from './test-dtos';

describe('Multer validation file pipe', () => {
    it('should not throw any errors with a SingleFileDto', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto));
        const path = getTestFilePath('cat.png');
        const res = await request(app).get('/').field('number', '123').attach('file', path);

        expect(res.body.data).toEqual({
            file: {
                buffer: 'Buffer',
                encoding: '7bit',
                mimeType: 'image/png',
                originalName: 'cat.png',
                sizeBytes: 7333311
            },
            number: '123'
        });
    });

    it('should not throw any errors with a MultipleFilesDto', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesDto));
        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.body).toEqual({
            data: {
                email: 'example@gmail.com',
                phone: '+15852826457',
                photos: [
                    {
                        buffer: 'Buffer',
                        encoding: '7bit',
                        mimeType: 'image/png',
                        originalName: 'cat1.png',
                        sizeBytes: 7333311
                    },
                    {
                        buffer: 'Buffer',
                        encoding: '7bit',
                        mimeType: 'image/png',
                        originalName: 'cat2.png',
                        sizeBytes: 560274
                    }
                ]
            }
        });
    });
});
