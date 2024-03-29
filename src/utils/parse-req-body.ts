import { AnyObject } from '@src/common/types/types.js';
import { isObject } from '@src/utils/is-object.js';

/**
 * Unfortunately, jest is not able to parse buffers resulting with an infinite loop.
 * Use this function to override buffer field with a "Buffer" string for sake of a test
 * @param body
 */
export const parseReqBody = (body: any): AnyObject => {
    const newBody: AnyObject = {};

    if (!isObject(body) && !Array.isArray(body)) {
        return body;
    }

    for (const key in body) {
        const value = (body as AnyObject)[key];

        if (value instanceof Buffer) {
            newBody[key] = 'Buffer';
            continue;
        }

        if (isObject(value)) {
            newBody[key] = parseReqBody(value);
            continue;
        }

        if (Array.isArray(value)) {
            newBody[key] = value.map((v) => parseReqBody(v));
            continue;
        }

        newBody[key] = value;
    }

    return newBody;
};
