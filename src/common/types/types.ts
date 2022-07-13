import { ErrorField } from '../errors';

export type AnyObject = Record<string | number | symbol, any>;
export type CustomErrorFactory = (errors: ErrorField[]) => Error;
