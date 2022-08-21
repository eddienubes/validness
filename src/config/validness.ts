import { ValidationConfig } from './validation-config.interface';
import { ConfigStore } from './config-store';

/**
 * Configures global validation config
 * @param overrides object to override default configuration
 */
export const validness = (overrides: Partial<ValidationConfig>): void => {
    ConfigStore.getInstance().setConfig(overrides);
};
