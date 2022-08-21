import { ConfigStore, VALIDATION_CONFIG_DEFAULTS, ValidationConfig } from '../../src/config';
import { FileValidatorType } from '../../src/common';

describe('Config Store', () => {
    it('should set config recursively in a proper way', function () {
        const instance = ConfigStore.getInstance();

        instance.setConfig({
            fileValidationConfig: {
                coreValidationFileType: FileValidatorType.EXPRESS_VALIDATOR,
                coreConfig: {
                    limits: {
                        fieldNameSize: 100
                    }
                }
            }
        });

        expect(instance.getConfig()).toEqual({
            ...VALIDATION_CONFIG_DEFAULTS,
            fileValidationConfig: {
                coreValidationFileType: FileValidatorType.EXPRESS_VALIDATOR,
                coreConfig: {
                    limits: {
                        fieldNameSize: 100
                    }
                }
            }
        } as ValidationConfig);
    });
});
