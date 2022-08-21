import { ValidationConfig } from './validation-config.interface';
import { VALIDATION_CONFIG_DEFAULTS } from '../common/constants/validators';

export class ConfigStore {
    private config: ValidationConfig = VALIDATION_CONFIG_DEFAULTS;

    private static instance: ConfigStore;

    public setConfig(overrides: Partial<ValidationConfig>): void {
        for (const key in overrides) {
            const typedKey = key as keyof typeof overrides;

            // get user defined config value
            let value = overrides[typedKey];

            // if it's undefined grab by key from defaults
            if (!value) {
                value = VALIDATION_CONFIG_DEFAULTS[typedKey];
            }

            this.config[typedKey] = value;
        }
    }

    public getConfig(): ValidationConfig {
        return { ...this.config };
    }

    public static getInstance(): ConfigStore {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ConfigStore();
        return this.instance;
    }
}
