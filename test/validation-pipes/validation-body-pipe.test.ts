import request from 'supertest';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from '@nestjs/class-validator';
import { createRouteWithPipe } from '../utils/createRouteAndGetBody';
import { validationBodyPipe } from '../../src';
import { Type } from '@nestjs/class-transformer';

class BodyDto {
    @IsString()
    name: string;

    @IsNumber()
    age: number;

    @ValidateNested()
    @Type(() => Picture)
    picture?: Picture;
}

class Picture {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
}

describe('Validation Body Pipe', () => {
    it('should validate and return correct result', async () => {
        const dto = new BodyDto();
        dto.age = 5;
        dto.name = 'asd';

        const app = createRouteWithPipe(validationBodyPipe(BodyDto));

        const res = await request(app).get('/').send(dto);

        expect(res.body.data).toEqual(dto);
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
            errors: [
                {
                    fields: [
                        {
                            field: 'name',
                            violations: ['name must be a string']
                        },
                        {
                            field: 'age',
                            violations: ['age must be a number conforming to the specified constraints']
                        }
                    ],
                    message: 'Received invalid values',
                    title: 'DefaultBodyErrorModel'
                }
            ]
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
            errors: [
                {
                    fields: [
                        {
                            field: 'name',
                            violations: ['name should not be empty']
                        }
                    ],
                    message: 'Received invalid values',
                    title: 'DefaultBodyErrorModel'
                }
            ]
        });
    });
});
