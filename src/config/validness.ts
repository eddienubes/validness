import { ValidationConfig, ConfigStore, DeepPartial } from '@src';

/**
 * Configures global validation config
 * @param overrides object to override default configuration
 */
export const validness = (overrides: DeepPartial<ValidationConfig>): void => {
    ConfigStore.getInstance().setConfig(overrides);
};
