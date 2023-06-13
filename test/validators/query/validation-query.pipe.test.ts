import { ConfigStore, validationFilePipe, validationQueryPipe, validness } from '@src';
import request from 'supertest';
import { QueryDto } from './models';
import { errorFactory, errorFactoryOverridden } from '@test/utils/error-utils';
import { createRouteWithPipe } from '@test/utils/server-utils';

describe('Validation Query Pipe', () => {
    afterEach(() => {
        ConfigStore.getInstance().resetToDefaults();
    });

    it('should validate correct query', async () => {
        const dto = new QueryDto();
        dto.name = 'asda';
        dto.age = 5;

        const app = createRouteWithPipe(validationQueryPipe(QueryDto));

        const res = await request(app).get('/').query(dto);
        expect(res.statusCode).toEqual(200);
        expect(res.badRequest).toBeFalsy();
    });

    it('should reject incorrect query', async () => {
        const dto = {
            name: 5,
            age: 'asd'
        };

        const app = createRouteWithPipe(validationQueryPipe(QueryDto));

        const res = await request(app).get('/').query(dto);

        expect(res.statusCode).toEqual(400);
        expect(res.badRequest).toBeTruthy();
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'age',
                    violations: ['age must be a number string']
                }
            ],
            name: 'DefaultQueryError',
            statusCode: 400
        });
    });

    it('should reject with error from custom error factory supplied by middleware', async () => {
        const dto = new QueryDto();
        dto.age = 'My age' as unknown as number;
        dto.name = 5 as unknown as string;

        validness({ customErrorFactory: errorFactory });

        const app = createRouteWithPipe(validationQueryPipe(QueryDto));

        const res = await request(app).get('/').query(dto);

        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'age',
                    violations: ['age must be a number string']
                }
            ],
            field: 'John Doe',
            name: 'MyError',
            statusCode: 403
        });
    });

    it('should override custom error factory from middleware', async () => {
        const dto = new QueryDto();
        dto.age = 'My age' as unknown as number;
        dto.name = 5 as unknown as string;

        validness({ customErrorFactory: errorFactory });

        const app = createRouteWithPipe(
            validationQueryPipe(QueryDto, { customErrorFactory: errorFactoryOverridden })
        );

        const res = await request(app).get('/').query(dto);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'age',
                    violations: ['age must be a number string']
                }
            ],
            name: 'MyOverriddenError',
            newField: 'New Field',
            oldField: 'Old field',
            statusCode: 401
        });
    });

    it('should reject calls with invalid content-type', async () => {
        const app = createRouteWithPipe(
            validationQueryPipe(QueryDto, {
                customErrorFactory: errorFactoryOverridden,
                contentTypes: ['application/json']
            })
        );

        const res = await request(app).get('/').send('').set('Content-Type', 'audio/wav');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'Content-Type header',
                    violations: ['Content-Type audio/wav is not allowed. Use [application/json]']
                }
            ],
            name: 'MyOverriddenError',
            newField: 'New Field',
            oldField: 'Old field',
            statusCode: 401
        });
    });
});
