import { ConfigStore, ValidationConfig, FileValidatorType } from '@src';

describe('Config Store', () => {
    it('should set config recursively in a proper way', function () {
        const instance = ConfigStore.getInstance();

        instance.setConfig({
            fileValidationConfig: {
                fileValidatorType: FileValidatorType.FORMIDABLE,
                coreConfig: {
                    limits: {
                        fieldNameSize: 100
                    }
                }
            }
        });

        expect(instance.getConfig()).toEqual({
            bodyValidationConfig: {
                forbidNonWhitelisted: true
            },
            fileValidationConfig: {
                coreConfig: {
                    limits: {
                        fieldNameSize: 100
                    },
                    multiples: true
                },
                fileValidatorType: 'FORMIDABLE',
                textFieldsValidationConfig: {
                    forbidNonWhitelisted: true
                }
            },
            queryValidationConfig: {
                forbidNonWhitelisted: true
            }
        } as ValidationConfig);
    });
});
