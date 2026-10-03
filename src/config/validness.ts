import { DeepPartial } from '../common/types/types.ts';
import { ValidationConfig } from './validation-config.interface.ts';
import { ConfigStore } from './config-store.ts';

/**
 * Configures global validation config
 * @param overrides object to override default configuration
 */
export const validness = (overrides: DeepPartial<ValidationConfig>): void => {
    ConfigStore.getInstance().setConfig(overrides);
};
