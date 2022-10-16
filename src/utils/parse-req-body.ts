import { AnyObject } from '../common';
import { isObject } from './is-object';

/**
 * Unfortunately, jest is not able to parse buffers resulting with an infinite loop.
 * Use this function to override buffer field with a "Buffer" string for sake of a test
 * @param body
 */
export const parseReqBody = (body: AnyObject): AnyObject => {
    const newBody: AnyObject = {};

    if (!isObject(body) || !Array.isArray(body)) {
        return body;
    }

    for (const key in body) {
        const value = body[key];

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
