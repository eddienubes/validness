import { AnyObject } from '@src';

export interface ClassConstructor extends Function {
    new (...args: any[]): AnyObject;
}
