import { DeepPartial, isObject, VALIDATION_CONFIG_DEFAULTS, ValidationConfig } from '@src';
import { ValidationConfigType } from '@src/config/validation-config-type.enum';
import { FileValidationConfig } from '@src/config/file-validation-config.interface';
import { QueryValidationConfig } from '@src/validators/query/types';
import { BodyValidationConfig } from '@src/validators/body/types';

export class ConfigStore {
    private config: ValidationConfig = VALIDATION_CONFIG_DEFAULTS;

    private static instance: ConfigStore;

    public setConfig(overrides: DeepPartial<ValidationConfig>): void {
        this.config = this.mapObjectWithOverridesAndDefaults<ValidationConfig>(
            this.config,
            overrides as ValidationConfig,
            VALIDATION_CONFIG_DEFAULTS
        );
    }

    public getConfig(): ValidationConfig {
        return { ...this.config };
    }

    public resetToDefaults() {
        this.config = VALIDATION_CONFIG_DEFAULTS;
    }

    public getByValidatorType(
        type: ValidationConfigType
    ): FileValidationConfig | QueryValidationConfig | BodyValidationConfig {
        switch (type) {
            case ValidationConfigType.FILE_VALIDATOR:
                return this.config.fileValidationConfig;
            case ValidationConfigType.BODY_VALIDATOR:
                return this.config.bodyValidationConfig;
            case ValidationConfigType.QUERY_VALIDATOR:
                return this.config.queryValidationConfig;
            default:
                throw new Error(`Unknown validator type: ${type}`);
        }
    }

    /**
     * Modifies an original object with overrides and defaults for those keys that are not set (undefined)
     * @param obj original object
     * @param overrides object with overridden fields
     * @param defaults defaults
     */
    private mapObjectWithOverridesAndDefaults<T>(obj: T, overrides: Partial<T>, defaults: T): T {
        for (const key in overrides) {
            const typedKey = key as keyof typeof overrides;

            // get overridden values
            let value = overrides[typedKey];

            // in case in modifiable object field is not defined, we just assign it
            if (!obj[typedKey]) {
                obj = {
                    ...obj,
                    [typedKey]: value
                };
                continue;
            }

            // recursively handle nested objects
            if (isObject(value)) {
                obj = {
                    ...obj,
                    [typedKey]: this.mapObjectWithOverridesAndDefaults(
                        obj[typedKey],
                        value,
                        defaults[typedKey]
                    )
                };
                continue;
            }

            // if it's an undefined grab by key from defaults
            if (!value) {
                value = defaults[typedKey];
            }

            obj[typedKey] = value as T[keyof T];
        }

        return obj;
    }

    public static getInstance(): ConfigStore {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ConfigStore();
        return this.instance;
    }
}
