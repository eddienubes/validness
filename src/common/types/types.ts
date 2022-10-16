import { ErrorField } from '../errors/error-field';

export type AnyObject = Record<string | number | symbol, any>;
export type CustomErrorFactory = (errors: ErrorField[]) => Error;
