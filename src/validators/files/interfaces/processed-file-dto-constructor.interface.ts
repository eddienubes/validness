import { FileValidationMap } from '../types';
import { Field } from 'multer';

export interface ProcessedFileDtoConstructor {
    fileValidationMap: FileValidationMap;
    multerFields: Field[];
}