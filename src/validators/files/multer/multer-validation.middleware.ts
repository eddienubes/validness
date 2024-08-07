import { RequestHandler } from 'express';
import { ConfigStore } from '@src/config/config-store.js';
import { MulterFile } from '@src/validators/files/multer/types.js';
import { isValidTextFields } from '@src/validators/files/helpers.js';
import { ClassConstructor } from '@src/common/interfaces/class-constructor.interface.js';
import { ProcessedFileDtoConstructor } from '@src/validators/files/interfaces/processed-file-dto-constructor.interface.js';
import { FileValidationConfig } from '@src/config/file-validation-config.interface.js';
import { ErrorField } from '@src/common/errors/error-field.js';
import { DefaultFileError } from '@src/validators/files/errors/default-file.error.js';

/**
 * Some validation logic preserved on upload stage by multer itself.
 * Here we just extend it with additional checks.
 * @param DtoConstructor
 * @param processedFileDtoConstructor
 * @param fileValidationConfig
 */
export const multerValidationMiddleware = (
    DtoConstructor: ClassConstructor,
    processedFileDtoConstructor: ProcessedFileDtoConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>
): RequestHandler => {
    return async (req, res, next) => {
        const globalConfig = ConfigStore.getInstance().getConfig();
        const errors: ErrorField[] = [];

        // Extended file validation
        for (const key in processedFileDtoConstructor.fileValidationMap) {
            const typedKey = key as keyof typeof req.files;

            const metadata = processedFileDtoConstructor.fileValidationMap[key];

            // We are certainly sure it's a multer file because we use .fields method.
            // See http://expressjs.com/en/resources/middleware/multer.html
            const files = req?.files?.[typedKey] as unknown as MulterFile[];

            // if field is not defined and required or is empty and required
            if ((!files || !files?.length) && !metadata.optional) {
                const contexts = !!metadata.context
                    ? { [metadata.decorator]: metadata.context }
                    : {};

                errors.push(
                    new ErrorField(
                        key,
                        [
                            `The following file field: [${key}] is empty, but required`
                        ],
                        contexts
                    )
                );
            }
        }

        // Text fields validation, basically repeats body or query validation
        const validationConfig =
            fileValidationConfig?.textFieldsValidationConfig ||
            globalConfig.fileValidationConfig.textFieldsValidationConfig;
        const { violatedFields, instance } = await isValidTextFields(
            DtoConstructor,
            req.body,
            processedFileDtoConstructor.fileValidationMap,
            validationConfig
        );
        errors.push(...violatedFields);

        if (errors.length) {
            return next(new DefaultFileError(errors));
        }

        // If everything is good, assign transformed instance to body and pass ctx to the next middleware
        req.body = instance;

        next();
    };
};
