import { ValidationConfig, ConfigStore } from '@src';

/**
 * Configures global validation config
 * @param overrides object to override default configuration
 */
export const validness = (overrides: Partial<ValidationConfig>): void => {
    ConfigStore.getInstance().setConfig(overrides);
};
