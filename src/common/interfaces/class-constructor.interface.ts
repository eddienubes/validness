import { AnyObject } from '@src/common/types/types.js';

export interface ClassConstructor<T = AnyObject> extends Function {
    new (...args: any[]): T;
}
