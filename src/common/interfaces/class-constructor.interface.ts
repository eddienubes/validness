import { AnyObject } from '../types/types.ts';

export interface ClassConstructor<T = AnyObject> extends Function {
    new (...args: any[]): T;
}
