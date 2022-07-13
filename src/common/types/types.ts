import { ErrorField } from '../models';

export type AnyObject = Record<string | number | symbol, any>;
export type CustomErrorFactory = (errors: ErrorField[]) => Error;
