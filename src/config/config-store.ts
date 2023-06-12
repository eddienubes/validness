import { ValidationConfig, VALIDATION_CONFIG_DEFAULTS, isObject, DeepPartial } from '@src';

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
