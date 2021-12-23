import { IsNumberString, IsString } from '@nestjs/class-validator';
import { createRouteWithPipe } from '../utils/createRouteAndGetBody';
import { validationQueryPipe } from '../../src';
import request from 'supertest';

class QueryDto {

  @IsString()
  name: string;

  @IsNumberString()
  age: number;
}


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
  });
})