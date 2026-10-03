import type { Field } from 'multer';
import { FileValidationMap } from '../types.ts';

export interface ProcessedFileDtoConstructor {
    [key: string]: FileValidationMap | Field[];

    /**
     * Used for our own validation
     */
    fileValidationMap: FileValidationMap;
    /**
     * Used for multer validation
     */
    multerFields: Field[];
}
