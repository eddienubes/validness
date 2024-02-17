import { defineConfig } from 'vitest/config';
import packageJson from './package.json';
import { builtinModules } from 'node:module';
import tsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
    // Define separate build configurations for CJS and ESM
    plugins: [tsConfigPaths(), dts({

    })],
    build: {
        outDir: 'build',
        rollupOptions: {
            input: './src/index.ts',
            preserveEntrySignatures: 'strict',
            output: [
                {
                    format: 'cjs',
                    dir: 'build/cjs',
                    entryFileNames: '[name].cjs.js',
                    preserveModules: true,
                    preserveModulesRoot: 'src'
                },
                {
                    format: 'esm',
                    dir: 'build/esm',
                    entryFileNames: '[name].esm.js',
                    preserveModules: true,
                    preserveModulesRoot: 'src'
                }
            ],
            external: [
                ...Object.keys(packageJson.dependencies),
                ...builtinModules.map((module) => `node:${module}`)
            ]
        },
        // Additional Vite-specific configurations for Node.js targeting
        target: 'node16',
        sourcemap: true // Enable source maps if desired
        // Treating all dependencies as external to avoid bundling them
        // This is common for Node.js libraries to keep the bundle size small
        // and rely on node_modules resolution
    }
    // Plugin configurations could go here
});
