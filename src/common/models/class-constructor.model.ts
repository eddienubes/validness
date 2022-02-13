import { AnyObject } from '../types/types';

export interface ClassConstructor extends Function {
    new (...args: any[]): AnyObject;
}
