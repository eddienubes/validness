import { FileValidationMap } from '../types';
import type { Field } from 'multer';

export interface ProcessedFileDtoConstructor {
    [key: string]: FileValidationMap | Field[];

    fileValidationMap: FileValidationMap;
    multerFields: Field[];
}
