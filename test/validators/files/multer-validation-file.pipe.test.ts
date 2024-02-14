import { request } from 'sagetest';
import { validationFilePipe } from '@src/index.js';
import { Options, diskStorage } from 'multer';
import { ConfigStore } from '@src/config/config-store.js';
import { createRouteWithPipe } from '@test/utils/server-utils.js';
import {
    IsFilesDecoratorWithTransformDto,
    MultipleFieldsWithWeirdSignDto,
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
} from '@test/validators/files/models.js';
import { getTestFilePath } from '@test/test-utils/files.js';
import { errorFactoryOverridden } from '@test/utils/error-utils.js';
import * as fs from 'fs';

const uploadOptions: Options = {
    storage: diskStorage({
        destination: 'test/test-data/uploads',
        filename(req, file, callback) {
            callback(null, file.originalname);
        }
    })
};

describe('Multer validation file pipe', () => {
    afterEach(() => {
        ConfigStore.getInstance().resetToDefaults();
    });

    it('should not throw any errors with a SingleFileDto', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto));
        const path = getTestFilePath('cat1.png');
        const readable = fs.createReadStream(path);
        const res = await request(app)
            .get('/')
            .field('number', '123')
            .attach('file', readable);

        expect(res.status).toEqual(200);
        expect(res.body.data).toEqual({
            file: {
                buffer: 'Buffer',
                mimeType: 'image/png',
                originalName: 'cat1.png',
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

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            data: {
                email: 'example@gmail.com',
                phone: '+15852826457',
                photos: [
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat1.png',
                        sizeBytes: 7333311
                    },
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat2.png',
                        sizeBytes: 560274
                    }
                ]
            }
        });
    });

    it('should throw an error when macCount limit is exceeded', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesMaxAmountDto)
        );

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

    it('should throw an error when maxSize limit is exceeded', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesMaxSizeDto)
        );

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1, { buffer: true })
            .attach('photos', path2, { buffer: true });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following field contains a file of size 7894088 bytes that exceeds the specified maximum limit: 10000 bytes'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when minSize limit is not respected', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesMinSizeDto)
        );

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');
        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos', path1, { buffer: true })
            .attach('photos', path2, { buffer: true });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following field contains a file of size 7894088 bytes that is lower than the specified minimal limit: 10000000 bytes'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when file type is invalid', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesTypeDto)
        );

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
                        'The following field contains file of the invalid mimetype image/png, but expected any of: [audio/aac,audio/midi,audio/x-midi,audio/mpeg,audio/ogg,audio/opus,audio/wav,audio/webm,audio/3gpp,audio/3gpp2]'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when file mimeType is invalid', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesMimeTypeDto)
        );

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
                        'The following field contains file of the invalid mimetype image/png, but expected: audio/mpeg'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should throw an error when file is required but not passed', async () => {
        const app = createRouteWithPipe(validationFilePipe(MultipleFilesDto));

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'photos',
                    violations: [
                        'The following file field: [photos] is empty, but required'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should NOT throw an error when file is option and not passed', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesOptionalDto)
        );

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

    it('should respect custom error handler', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesDto, {
                customErrorFactory: errorFactoryOverridden
            })
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
                    violations: [
                        'The following file field: [photos] is empty, but required'
                    ]
                }
            ],
            name: 'MyOverriddenError',
            newField: 'New Field',
            oldField: 'Old field',
            statusCode: 401
        });
    });

    it('should consider array text fields', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFilesOptionalArrayTextDto)
        );

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

    it('should throw an error when multiple files has been sent for a single file dto', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(SingleFileNoTextDto)
        );

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
                        'The following file field [file] has exceeded its maxCount or is not expected'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should upload file with undefined mimetype', async () => {
        const app = createRouteWithPipe(validationFilePipe(SingleFileDto));

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app)
            .get('/')
            .field('number', '123123')
            .attach('file', path1);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            data: {
                file: {
                    buffer: 'Buffer',
                    mimeType: 'application/octet-stream',
                    originalName: 'file-wrong-mime-type',
                    sizeBytes: 17
                },
                number: '123123'
            }
        });
    });

    it('should NOT upload if file parameters are invalid', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(SingleFileWithTypeDto, {
                coreConfig: uploadOptions
            })
        );

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app)
            .get('/')
            .field('number', '123123')
            .attach('file', path1);

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

    it('should include path and destination when uploading a file', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(SingleFileDto, {
                coreConfig: uploadOptions
            })
        );

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app)
            .get('/')
            .field('number', '123123')
            .attach('file', path1);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual({
            file: {
                destination: 'test/test-data/uploads',
                fileName: 'file-wrong-mime-type',
                mimeType: 'application/octet-stream',
                originalName: 'file-wrong-mime-type',
                path: 'test/test-data/uploads/file-wrong-mime-type',
                sizeBytes: 17
            },
            number: '123123'
        });
    });

    it('should NOT upload files if text fields validation fails', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(SingleFileDto, {
                coreConfig: uploadOptions
            })
        );

        const path1 = getTestFilePath('file-wrong-mime-type');
        const res = await request(app)
            .get('/')
            .field('number', 'asd')
            .attach('file', path1);

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

    it('should send multer files properly with [] sign in name', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFieldsWithWeirdSignDto)
        );

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');

        const res = await request(app)
            .get('/')
            .field('phone', '+15852826457')
            .field('email', 'example@gmail.com')
            .attach('photos[]', path1)
            .attach('photos[]', path2);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            data: {
                email: 'example@gmail.com',
                phone: '+15852826457',
                'photos[]': [
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat1.png',
                        sizeBytes: 7333311
                    },
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat2.png',
                        sizeBytes: 560274
                    }
                ]
            }
        });
    });

    it('should reject calls with invalid content-type', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(MultipleFieldsWithWeirdSignDto)
        );

        const res = await request(app)
            .get('/')
            .send('')
            .set('Content-Type', 'audio/wav');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'Content-Type header',
                    violations: [
                        'Content-Type audio/wav is not allowed. Use [multipart/form-data]'
                    ]
                }
            ],
            name: 'DefaultFileError',
            statusCode: 400
        });
    });

    it('should call transform decorator only once when file pipe applied', async () => {
        const app = createRouteWithPipe(
            validationFilePipe(IsFilesDecoratorWithTransformDto)
        );

        const path1 = getTestFilePath('cat1.png');
        const path2 = getTestFilePath('cat2.png');

        const res = await request(app)
            .get('/')
            .field('count', '0')
            .attach('files', path1)
            .attach('files', path2)
            .attach('files', path2);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            data: {
                count: 1,
                files: [
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat1.png',
                        sizeBytes: 7333311
                    },
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat2.png',
                        sizeBytes: 560274
                    },
                    {
                        buffer: 'Buffer',
                        mimeType: 'image/png',
                        originalName: 'cat2.png',
                        sizeBytes: 560274
                    }
                ]
            }
        });
    });
});
