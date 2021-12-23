import request from 'supertest';
import { IsNumber, IsString } from '@nestjs/class-validator';
import { createRouteWithPipe } from '../utils/createRouteAndGetBody';
import { validationBodyPipe } from '../../src/validation-body-pipe/validation-body-pipe';

class BodyDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
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
    expect(res.body).toEqual({})
    expect(res.statusCode).toEqual(400);
  });
});