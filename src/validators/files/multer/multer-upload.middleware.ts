import multer, { Options } from 'multer';
import { fileFilter } from './file-filter';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { RequestHandler } from 'express';
import { FileValidationConfig } from '../../../config/file-validation-config.interface';
import { ConfigStore } from '../../../config';
import { ClassConstructor } from '../../../common';

export const multerUploadMiddleware = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): RequestHandler => {
    const configStore = ConfigStore.getInstance().getConfig();
    const coreConfig = fileValidationConfig?.coreConfig || configStore.fileValidationConfig.coreConfig;

    const upload = multer({
        ...coreConfig,
        fileFilter: fileFilter(DtoConstructor, processedFileDtoConstructor.fileValidationMap)
    });

    return upload.fields(processedFileDtoConstructor.multerFields);
};
