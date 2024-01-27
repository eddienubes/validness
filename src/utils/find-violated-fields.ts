import { ErrorField } from '@src/index.js';
import { ValidationError } from 'class-validator';

export const findViolatedFields = (errorObjects: ValidationError[]): ErrorField[] => {
    const errors: ErrorField[] = [];

    if (!errorObjects.length) {
        return errors;
    }

    for (const object of errorObjects) {
        if (object.constraints) {
            const rawConstraints: string[] = [];

            for (const constraintKey in object.constraints) {
                rawConstraints.push(object.constraints[constraintKey]);
            }

            errors.push(new ErrorField(object.property, rawConstraints));
        }

        if (object.children?.length) {
            errors.push(...findViolatedFields(object.children));
        }
    }

    return errors;
};
