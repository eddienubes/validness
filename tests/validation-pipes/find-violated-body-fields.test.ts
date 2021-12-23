import { ValidationError } from '@nestjs/class-validator';
import { ErrorField } from '../../src/validation-body-pipe/models/error-body-field.model';
import { findViolatedBodyFields } from '../../src/validation-body-pipe/implementation/find-violated-body-fields.impl';

describe('Find Violated Fields', () => {
  it('should retrieve constraints with fields names out of nested object', () => {
    const mainValidError = new ValidationError();
    const child1 = new ValidationError();
    const child2 = new ValidationError();
    const child1OfChild1 = new ValidationError();

    mainValidError.constraints = {
      isEnum: 'violated',
      isString: 'violated'
    };
    mainValidError.property = 'mainValidError';
    mainValidError.children = [child1, child2];

    child1.property = 'child1';
    child1.constraints = {
      isEnum: 'violated',
      isString: 'violated'
    };
    child1.children = [child1OfChild1];

    child2.property = 'child2';
    child2.constraints = {
      isEnum: 'violated',
      isString: 'violated'
    };

    child1OfChild1.property = 'child1OfChild1';
    child1OfChild1.constraints = {
      isEnum: 'violated',
      isString: 'violated'
    };

    const fields = findViolatedBodyFields([mainValidError]);
    expect(fields.sort((a, b) => a.field.length - b.field.length)).toEqual(
      ([
        {
          field: 'mainValidError',
          violations: ['violated', 'violated']
        },
        {
          field: 'child1',
          violations: ['violated', 'violated']
        },
        {
          field: 'child2',
          violations: ['violated', 'violated']
        },
        {
          field: 'child1OfChild1',
          violations: ['violated', 'violated']
        }
      ] as ErrorField[]).sort((a, b) => a.field.length - b.field.length)
    );
  });
});
