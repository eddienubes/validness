import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BaseHttpError, ErrorField } from '@src/index.js';
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

export class BodyDtoWithContext extends BodyDto {
    @IsNumber(undefined, {
        context: {
            i18n: 'form.age',
            value: 123
        }
    })
    // initializer to override the paren class' age
    age: number = 1;
}

export class MyCustomError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly errors: ErrorField[]
    ) {
        super(message);
        this.name = MyCustomError.name;
    }
}

export class MyError extends BaseHttpError {
    constructor(
        private readonly field: string,
        private readonly errors: ErrorField[]
    ) {
        super(StatusCodes.FORBIDDEN, 'MyError');
    }
}

export class MyOverriddenError extends BaseHttpError {
    constructor(
        private readonly newField: string,
        private readonly errors: ErrorField[],
        private readonly oldField: string
    ) {
        super(StatusCodes.UNAUTHORIZED, 'MyOverriddenError');
    }
}
