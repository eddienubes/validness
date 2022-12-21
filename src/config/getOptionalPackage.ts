import { AnyObject } from '@src';

export const getOptionalPackage = <T = AnyObject>(name: string): T | null => {
    try {
        return require(name) as T;
    } catch (e) {
        console.log(`Module ${name} was not found`);
        return null;
    }
};
