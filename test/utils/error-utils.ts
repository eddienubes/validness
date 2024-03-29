import { CustomErrorFactory } from '@src/common/types/types.js';
import { MyError, MyOverriddenError } from '@test/validators/body/models.js';

export const errorFactory: CustomErrorFactory = (errors) =>
    new MyError('John Doe', errors);
export const errorFactoryOverridden: CustomErrorFactory = (errors) =>
    new MyOverriddenError('New Field', errors, 'Old field');
