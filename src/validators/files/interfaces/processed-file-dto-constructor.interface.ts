import { FileValidationMap } from '../types';
import { Field } from 'multer';

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
