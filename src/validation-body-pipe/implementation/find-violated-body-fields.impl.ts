import { ErrorField } from '../models/error-body-field.model';
import { ValidationError } from '@nestjs/class-validator';

export const findViolatedBodyFields = (errorObjects: ValidationError[]): ErrorField[] => {
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
      errors.push(...findViolatedBodyFields(object.children));
    }
  }

  return errors;
};
