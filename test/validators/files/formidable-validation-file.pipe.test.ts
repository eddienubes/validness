import { createRouteWithPipe } from '../../utils/server-utils';
import { FileValidatorType, validationFilePipe } from '../../../src';
import { MultipleFilesDto, SingleFileDto } from './models';
import { getFormidableUploadFolderPath, getTestFilePath } from '../../test-utils/files';
import request from 'supertest';
import { FileValidationConfig } from '../../../src/config/file-validation-config.interface';

const options: Partial<FileValidationConfig> = {
    fileValidatorType: FileValidatorType.FORMIDABLE,
    coreConfig: {
        uploadDir: getFormidableUploadFolderPath(),
        keepExtensions: true,
        filename: (name, ext) => {
            return name + ext;
        },
        multiples: true
    }
};

describe('Formidable validation pipe', () => {
    it('should NOT throw any errors with a SingleFileDto', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto, options));

        const path = getTestFilePath('cat1.png');
        const res = await request(app).get('/').field('number', '123').attach('file', path);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual({
            file: {
                destination: expect.any(String),
                fileName: 'cat1.png',
                mimeType: 'image/png',
                originalName: 'cat1.png',
                path: expect.any(String),
                sizeBytes: 7333311
            },
            number: '123'
        });
    });

    it('should NOT throw any errors with a MultipleFilesDto', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('email', 'asda@example.com')
            .field('phone', '+15852826457')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual({
            email: 'asda@example.com',
            phone: '+15852826457',
            photos: [
                {
                    destination: expect.any(String),
                    fileName: 'cat1.png',
                    mimeType: 'image/png',
                    originalName: 'cat1.png',
                    path: expect.any(String),
                    sizeBytes: 7333311
                },
                {
                    destination: expect.any(String),
                    fileName: 'cat2.png',
                    mimeType: 'image/png',
                    originalName: 'cat2.png',
                    path: expect.any(String),
                    sizeBytes: 560274
                }
            ]
        });
    });
});
