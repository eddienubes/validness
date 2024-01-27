import { FileValidatorType } from '@src/index.js';
import { ConfigStore } from '@src/config/config-store.js';

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
                contentTypes: ['application/json']
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
                textFieldsValidationConfig: {}
            },
            queryValidationConfig: {
                contentTypes: []
            }
        });
    });
});
