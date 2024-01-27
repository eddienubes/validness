import { Field } from 'multer';
import { FileValidationMap } from '@src/validators/files/types.js';

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
