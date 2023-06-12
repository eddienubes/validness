import { AnyObject } from '@src';

export interface ClassConstructor<T = AnyObject> extends Function {
    new (...args: any[]): T;
}
