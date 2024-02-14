import { request } from 'sagetest';
import { validationBodyPipe, validness } from '@src/index.js';
import { StatusCodes } from 'http-status-codes';
import { ConfigStore } from '@src/config/config-store.js';
import { BodyDto, MyCustomError } from '@test/validators/body/models.js';
import { createRouteWithPipe } from '@test/utils/server-utils.js';
import {
    errorFactory,
    errorFactoryOverridden
} from '@test/utils/error-utils.js';

describe('Validation Body Pipe', () => {
    afterEach(() => {
        ConfigStore.getInstance().resetToDefaults();
    });

    it('should validate and return correct result', async () => {
        const dto = new BodyDto();
        dto.age = 5;
        dto.name = 'asd';
        dto.transformed = '  value  ';

        const app = createRouteWithPipe(validationBodyPipe(BodyDto));

        const res = await request(app).get('/').send(dto);

        expect(res.body.data).toEqual({
            ...dto,
            transformed: 'value'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should validate and return error', async () => {
        const dto = {
            age: 'age',
            name: 5
        };

        const app = createRouteWithPipe(validationBodyPipe(BodyDto));

        const res = await request(app).get('/').send(dto);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'name',
                    violations: ['name must be a string']
                },
                {
                    field: 'age',
                    violations: [
                        'age must be a number conforming to the specified constraints'
                    ]
                },
                {
                    field: 'transformed',
                    violations: [
                        'transformed must be a string',
                        'transformed should not be empty'
                    ]
                }
            ],
            name: 'DefaultBodyError',
            statusCode: 400
        });
        expect(res.statusCode).toEqual(400);
    });

    it('should validated nested dtos', async () => {
        const dto = new BodyDto();
        dto.age = 5;
        dto.name = 'asd';
        dto.picture = {
            name: '' // empty string violates the rules
        };

        const app = createRouteWithPipe(validationBodyPipe(BodyDto));

        const res = await request(app).get('/').send(dto);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'name',
                    violations: ['name should not be empty']
                },
                {
                    field: 'transformed',
                    violations: [
                        'transformed must be a string',
                        'transformed should not be empty'
                    ]
                }
            ],
            name: 'DefaultBodyError',
            statusCode: 400
        });
    });

    it('should be customised correctly with custom error factory', async () => {
        const dto = {
            age: 'age',
            name: 5
        };

        const app = createRouteWithPipe(
            validationBodyPipe(BodyDto, {
                customErrorFactory: (errors) =>
                    new MyCustomError(
                        'my custom message',
                        StatusCodes.CONFLICT,
                        errors
                    )
            })
        );

        const res = await request(app).get('/').send(dto);

        expect(res.statusCode).toEqual(409);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'name',
                    violations: ['name must be a string']
                },
                {
                    field: 'age',
                    violations: [
                        'age must be a number conforming to the specified constraints'
                    ]
                },
                {
                    field: 'transformed',
                    violations: [
                        'transformed must be a string',
                        'transformed should not be empty'
                    ]
                }
            ],
            name: 'MyCustomError',
            statusCode: 409
        });
        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    });

    it('should reject with error from custom error factory supplied by middleware', async () => {
        const dto = new BodyDto();
        dto.age = 5;
        dto.name = 'asd';
        dto.picture = {
            name: '' // empty string violates the rules
        };

        // call validness function to override default config
        validness({ customErrorFactory: errorFactory });

        const app = createRouteWithPipe(validationBodyPipe(BodyDto));

        const res = await request(app).get('/').send(dto);

        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'name',
                    violations: ['name should not be empty']
                },
                {
                    field: 'transformed',
                    violations: [
                        'transformed must be a string',
                        'transformed should not be empty'
                    ]
                }
            ],
            field: 'John Doe',
            name: 'MyError',
            statusCode: 403
        });
    });

    it('should override custom error factory from middleware', async () => {
        const dto = new BodyDto();
        dto.age = 5;
        dto.name = 'asd';
        dto.picture = {
            name: '' // empty string violates the rules
        };

        // call validness function to override default config
        validness({ customErrorFactory: errorFactory });

        const app = createRouteWithPipe(
            validationBodyPipe(BodyDto, {
                customErrorFactory: errorFactoryOverridden
            })
        );

        const res = await request(app).get('/').send(dto);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'name',
                    violations: ['name should not be empty']
                },
                {
                    field: 'transformed',
                    violations: [
                        'transformed must be a string',
                        'transformed should not be empty'
                    ]
                }
            ],
            name: 'MyOverriddenError',
            newField: 'New Field',
            oldField: 'Old field',
            statusCode: 401
        });
    });

    it('should reject requests with invalid content-type', async () => {
        const app = createRouteWithPipe(validationBodyPipe(BodyDto));
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
                        'Content-Type audio/wav is not allowed. Use [application/json]'
                    ]
                }
            ],
            name: 'DefaultBodyError',
            statusCode: 400
        });
    });
});
