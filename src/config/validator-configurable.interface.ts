import { CustomErrorFactory } from '../common/types/types.ts';

export interface ValidatorConfigurable {
    customErrorFactory?: CustomErrorFactory;
    /**
     * Allowed content-types.
     * @default ['application/json'] only for Body, any for Query, ['multipart/form-data'] only for File
     */
    contentTypes: string[];
}
