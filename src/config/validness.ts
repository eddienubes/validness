import { DeepPartial } from '@src/common/types/types.js';
import { ValidationConfig } from '@src/config/validation-config.interface.js';
import { ConfigStore } from '@src/config/config-store.js';

/**
 * Configures global validation config
 * @param overrides object to override default configuration
 */
export const validness = (overrides: DeepPartial<ValidationConfig>): void => {
    ConfigStore.getInstance().setConfig(overrides);
};
