import request from 'supertest';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from '@nestjs/class-validator';
import { createRouteWithPipe } from '../utils/createRouteAndGetBody';
import { ErrorField, validationBodyPipe } from '../../src';
import { Transform, Type } from '@nestjs/class-transformer';
import { StatusCodes } from 'http-status-codes';

class BodyDto {
    @IsString()
    name: string;

    @IsNumber()
    age: number;

    @ValidateNested()
    @Type(() => Picture)
    picture?: Picture;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsString()
    transformed: string;
}

class Picture {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
}

class MyCustomError extends Error {
    constructor(message: string, public readonly statusCode: number, public readonly errors: ErrorField[]) {
        super(message);
        this.name = MyCustomError.name;
    }
}

describe('Validation Body Pipe', () => {
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

        expect(res.badRequest).toBeTruthy();
        expect(res.body).toEqual({
            fields: [
                {
                    field: 'name',
                    violations: ['name must be a string']
                },
                {
                    field: 'age',
                    violations: ['age must be a number conforming to the specified constraints']
                },
                {
                    field: 'transformed',
                    violations: ['transformed must be a string', 'transformed should not be empty']
                }
            ],
            name: 'DefaultBodyErrorModel',
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
                    violations: ['transformed must be a string', 'transformed should not be empty']
                }
            ],
            name: 'DefaultBodyErrorModel',
            statusCode: 400
        });
    });

    it('should be customised correctly with custom error factory', async () => {
        const dto = {
            age: 'age',
            name: 5
        };

        const app = createRouteWithPipe(
            validationBodyPipe(BodyDto, (errors) => new MyCustomError('my custom message', StatusCodes.CONFLICT, errors))
        );

        const res = await request(app).get('/').send(dto);

        expect(res.badRequest).toBeFalsy();
        expect(res.body).toEqual({
            errors: [
                {
                    field: 'name',
                    violations: ['name must be a string']
                },
                {
                    field: 'age',
                    violations: ['age must be a number conforming to the specified constraints']
                },
                {
                    field: 'transformed',
                    violations: ['transformed must be a string', 'transformed should not be empty']
                }
            ],
            name: 'MyCustomError',
            statusCode: 409
        });
        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    });
});
