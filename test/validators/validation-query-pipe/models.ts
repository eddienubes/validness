import { IsNumberString, IsString } from '@nestjs/class-validator';

export class QueryDto {
    @IsString()
    name: string;

    @IsNumberString()
    age: number;
}
