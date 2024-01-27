import { AnyObject } from '@src/index.js';

export interface ClassConstructor<T = AnyObject> extends Function {
    new (...args: any[]): T;
}
