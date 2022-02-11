import { ErrorField } from '../models/error-field.model';

export type AnyObject = Record<string, any>;
export type ClassConstructor = { new (...args: unknown[]): AnyObject };
export type ErrorConstructor = { new (errors: ErrorField[], ...args: unknown[]): AnyObject };
