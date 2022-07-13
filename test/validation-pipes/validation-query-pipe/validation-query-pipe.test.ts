import { validationConfigPipe, validationQueryPipe } from '../../../src';
import request from 'supertest';
import { QueryDto } from './models';
import { errorFactory, errorFactoryOverridden } from '../../utils/error-utils';
import { createRouteWithPipe } from '../../utils/server-utils';

describe('Validation Query Pipe', () => {
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

        const app = createRouteWithPipe(
            validationQueryPipe(QueryDto),
            validationConfigPipe({
                customErrorFactory: errorFactory
            })
        );

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

        const app = createRouteWithPipe(
            validationQueryPipe(QueryDto, errorFactoryOverridden),
            validationConfigPipe({
                customErrorFactory: errorFactory
            })
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
});
