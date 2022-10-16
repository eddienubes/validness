import { ConfigStore, ValidationConfig } from '../../src';
import { FileValidatorType } from '../../src';

describe('Config Store', () => {
    it('should set config recursively in a proper way', function () {
        const instance = ConfigStore.getInstance();

        instance.setConfig({
            fileValidationConfig: {
                fileValidatorType: FileValidatorType.EXPRESS_VALIDATOR,
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
                    }
                },
                fileValidatorType: 'EXPRESS_VALIDATOR',
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
