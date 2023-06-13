import { createRouteWithPipe } from '@test/utils/server-utils';
import { ConfigStore, FileValidatorType, validationBodyPipe, validationFilePipe } from '@src';
import {
    MultipleFilesDto,
    MultipleFilesMaxAmountDto,
    MultipleFilesMaxSizeDto,
    MultipleFilesMimeTypeDto,
    MultipleFilesMinSizeDto,
    MultipleFilesOptionalArrayTextDto,
    MultipleFilesOptionalDto,
    MultipleFilesTypeDto,
    SingleFileDto,
    SingleFileNoTextDto,
    SingleFileWithTypeDto
} from './models';
import { getFormidableUploadFolderPath, getTestFilePath } from '@test/test-utils/files';
import request from 'supertest';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { errorFactoryOverridden } from '@test/utils/error-utils';
import { BodyDto } from '@test/validators/body/models';

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
    afterEach(() => {
        ConfigStore.getInstance().resetToDefaults();
    });

    it('should NOT throw any errors with a SingleFileDto formidable', async () => {
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

    it('should NOT throw any errors with a MultipleFilesDto formidable', async () => {
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

    it('should send formidable files properly with [] sign in name formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos[]', path1)
            .attach('photos[]', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: ['The following file field: [photos] is empty, but required']
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should rethrow formidable core error formidable', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesDto, {
                ...options,
                coreConfig: { ...options.coreConfig, maxFileSize: 1 }
            })
        );

        const path1 = getTestFilePath('cat1.png');

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({
            code: 1009,
            httpCode: 413
        });
    });

    it('should throw an error when macCount limit is exceeded formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesMaxAmountDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following file field [photos] has exceeded its maxCount or is not expected'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when maxSize limit is exceeded formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesMaxSizeDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following field contains a file of size 7333311 bytes that exceeds the specified maximum limit: 10000 bytes',
                        'The following field contains a file of size 560274 bytes that exceeds the specified maximum limit: 10000 bytes'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when minSize limit is not respected formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesMinSizeDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following field contains a file of size 7333311 bytes that is lower than the specified minimal limit: 10000000 bytes',
                        'The following field contains a file of size 560274 bytes that is lower than the specified minimal limit: 10000000 bytes'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when file type is invalid formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesTypeDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following field contains file of the invalid mimetype image/png, but expected any of: [audio/aac,audio/midi,audio/x-midi,audio/mpeg,audio/ogg,audio/opus,audio/wav,audio/webm,audio/3gpp,audio/3gpp2]',
                        'The following field contains file of the invalid mimetype image/png, but expected any of: [audio/aac,audio/midi,audio/x-midi,audio/mpeg,audio/ogg,audio/opus,audio/wav,audio/webm,audio/3gpp,audio/3gpp2]'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when file mimeType is invalid formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesMimeTypeDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1)
            .attach('photos', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following field contains file of the invalid mimetype image/png, but expected: audio/mpeg',
                        'The following field contains file of the invalid mimetype image/png, but expected: audio/mpeg'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when file is required but not passed formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesDto, options));

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: ['The following file field: [photos] is empty, but required']
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should NOT throw an error when file is optional and not passed formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesOptionalDto, options));

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            data: {
                email: 'example@gmail.com',
                phone: '+15852826457'
            }
        });
    });

    it('should respect custom error handler formidable', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesDto, { customErrorFactory: errorFactoryOverridden, ...options })
        );

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'photos',
                    violations: ['The following file field: [photos] is empty, but required']
                }
            ],
            name: 'MyOverriddenError',
            newField: 'New Field',
            oldField: 'Old field',
            statusCode: 401
        });
    });

    it('should consider array text fields formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesOptionalArrayTextDto));

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('numbers', '123')
            .field('numbers', '123');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            data: {
                numbers: ['123', '123'],
                phone: '+15852826457'
            }
        });
    });

    it('should throw an error when multiple files has been sent for a single file dto formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileNoTextDto, options));

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('file', path1)
            .attach('file', path2);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'file',
                    violations: [
                        'The following file field [file] has exceeded its maxCount (1) or is not expected'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should upload file with undefined mimetype formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto, options));

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app).get('/').field('number', '123123').attach('file', path1);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual({
            file: {
                destination: expect.any(String),
                fileName: 'file-wrong-mime-type',
                mimeType: 'application/octet-stream',
                originalName: 'file-wrong-mime-type',
                path: expect.any(String),
                sizeBytes: 17
            },
            number: '123123'
        });
    });

    it('should NOT upload if file parameters are invalid formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileWithTypeDto, options));

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app).get('/').field('number', '123123').attach('file', path1);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'file',
                    violations: [
                        'The following field contains file of the invalid mimetype application/octet-stream, but expected any of: [image/avif,image/bmp,image/gif,image/vnd.microsoft.icon,image/jpeg,image/png,image/svg+xml,image/tiff,image/webp]'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should include path and destination when uploading a file formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto, options));

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app).get('/').field('number', '123123').attach('file', path1);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual({
            file: {
                destination: expect.any(String),
                fileName: 'file-wrong-mime-type',
                mimeType: 'application/octet-stream',
                originalName: 'file-wrong-mime-type',
                path: expect.any(String),
                sizeBytes: 17
            },
            number: '123123'
        });
    });

    it('should NOT upload files if text fields validation fails formidable', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto, options));

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app).get('/').field('number', 'asd').attach('file', path1);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'number',
                    violations: ['number must be a number string']
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should reject calls with invalid content-type', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto, options));

        const res = await request(app).get('/').send('').set('Content-Type', 'audio/wav');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'Content-Type header',
                    violations: ['Content-Type audio/wav is not allowed. Use [multipart/form-data]']
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });
});
