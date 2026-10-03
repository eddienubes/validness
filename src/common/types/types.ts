import { ErrorField } from '../errors/error-field.ts';

export type AnyObject = Record<string | number | symbol, any>;
export type CustomErrorFactory = (errors: ErrorField[]) => Error;
export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
