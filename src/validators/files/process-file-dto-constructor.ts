import type { Field } from 'multer';
import { FileValidationMap } from './types.ts';
import {
    FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY,
    FILE_VALIDATION_METADATA_KEY
} from './constants.ts';
import { ClassConstructor } from '../../common/interfaces/class-constructor.interface.ts';
import { FileMetadata } from './interfaces/file-metadata.interface.ts';
import { ProcessedFileDtoConstructor } from './interfaces/processed-file-dto-constructor.interface.ts';

export const processFileDtoConstructor = (
    DtoConstructor: ClassConstructor
): ProcessedFileDtoConstructor => {
    const map: FileValidationMap = {};
    const multerFields: Field[] = [];

    // might not be defined when there are no fields marked with IsFile/IsFiles decorators
    const decoratedFieldsList =
        (Reflect.getMetadata(
            FILE_VALIDATION_DECORATED_FIELDS_LIST_KEY,
            DtoConstructor.prototype
        ) as string[]) || [];

    for (const key of decoratedFieldsList) {
        const metadata = Reflect.getMetadata(
            FILE_VALIDATION_METADATA_KEY,
            DtoConstructor.prototype,
            key
        ) as FileMetadata;

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
