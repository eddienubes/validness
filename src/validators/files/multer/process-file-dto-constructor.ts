import { ClassConstructor } from '../../../common';
import { ProcessedFileDtoConstructor } from '../interfaces/processed-file-dto-constructor.interface';
import { FileValidationMap } from '../types';
import { Field } from 'multer';
import { FILE_VALIDATION_METADATA_KEY } from '../constants';
import { FileMetadata } from '../interfaces/file-metadata.interface';

export const processFileDtoConstructor = (DtoConstructor: ClassConstructor): ProcessedFileDtoConstructor => {
    const map: FileValidationMap = {};
    const multerFields: Field[] = [];

    for (const key in DtoConstructor) {
        const metadata = Reflect.getMetadata(FILE_VALIDATION_METADATA_KEY, DtoConstructor, key) as FileMetadata;

        if (!metadata) {
            continue;
        }

        map[key] = metadata;

        // if multiple is true rely only on user specified value otherwise set to 1
        const maxCount = metadata.multiple ? metadata.maxAmount : 1;

        multerFields.push({
            name: key,
            maxCount
        });
    }

    return {
        fileValidationMap: map,
        multerFields
    };
};