import { ErrorField } from '../../validation-body-pipe/models/error-body-field.model';


export type AnyObject = Record<string, any>;
export type ClassConstructor = { new(...args: unknown[]): AnyObject }
export type ErrorConstructor = { new(errors: ErrorField[], ...args: unknown[]): AnyObject }
