import { IsNumberString, IsString } from 'class-validator';

export class QueryDto {
    @IsString()
    name: string;

    @IsNumberString()
    age: number;
}
