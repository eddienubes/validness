import 'reflect-metadata';

export { validationBodyPipe, DefaultBodyError } from './validation-body-pipe';
export { validationQueryPipe, DefaultQueryError } from './validation-query-pipe';

export { BaseError, ErrorField, UserCustomError } from 'common/errors';
export { ClassConstructor } from './common/interfaces';

export { AnyObject, CustomErrorFactory } from './common/types/types';
