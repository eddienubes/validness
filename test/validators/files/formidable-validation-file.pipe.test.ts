import { createRouteWithPipe } from '../../utils/server-utils';
import { FileValidatorType, validationFilePipe } from '../../../src';
import { SingleFileDto } from './models';
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
        }
    }
};

describe('Formidable validation pipe', () => {
    it('should test asd', async () => {
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
});
