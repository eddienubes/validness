import { CustomErrorFactory } from '@src';
import { MyError, MyOverriddenError } from '@test/validators/body/models';

export const errorFactory: CustomErrorFactory = (errors) => new MyError('John Doe', errors);
export const errorFactoryOverridden: CustomErrorFactory = (errors) =>
    new MyOverriddenError('New Field', errors, 'Old field');
