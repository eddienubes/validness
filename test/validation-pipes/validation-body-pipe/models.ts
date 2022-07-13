import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from '@nestjs/class-validator';
import { Transform, Type } from '@nestjs/class-transformer';
import { BaseError, ErrorField } from '../../../src';
import { StatusCodes } from 'http-status-codes';

export class Picture {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
}

export class BodyDto {
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

export class MyCustomError extends Error {
    constructor(message: string, public readonly statusCode: number, public readonly errors: ErrorField[]) {
        super(message);
        this.name = MyCustomError.name;
    }
}

export class MyError extends BaseError {
    constructor(private readonly field: string, private readonly errors: ErrorField[]) {
        super(StatusCodes.FORBIDDEN, 'MyError');
    }
}

export class MyOverriddenError extends BaseError {
    constructor(private readonly newField: string, private readonly errors: ErrorField[], private readonly oldField: string) {
        super(StatusCodes.UNAUTHORIZED, 'MyOverriddenError');
    }
}
