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
                },
                contentTypes: []
            }
        });

        expect(instance.getConfig()).toEqual({
            bodyValidationConfig: {
                contentTypes: ['application/json'],
                forbidNonWhitelisted: true
            },
            fileValidationConfig: {
                contentTypes: [],
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
                contentTypes: [],
                forbidNonWhitelisted: true
            }
        } as ValidationConfig);
    });
});
