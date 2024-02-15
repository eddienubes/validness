import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        disableConsoleIntercept: true,
        setupFiles: ['test/setup.ts']
    }
});
