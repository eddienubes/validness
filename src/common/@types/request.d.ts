declare namespace Express {
    import { ValidatorOptions } from '@nestjs/class-validator';

    export interface Request {
        queryValidationConfig?: ValidatorOptions;
        bodyValidationConfig?: ValidatorOptions;
    }
}
