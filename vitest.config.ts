// =============================================================================
// Vitest Configuration
// =============================================================================
// This file tells Vitest how to find and run your tests.
//
// KEY CONCEPTS:
// - `test.globals`: Makes `describe`, `it`, `expect` available without imports
// - `test.environment`: Use 'node' for server-side code, 'jsdom' for browser code
// - `resolve.alias`: Allows using `@/` imports in tests (same as your app)
// =============================================================================

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        // Make test functions globally available (like Jest)
        globals: true,

        // Use Node.js environment for server-side tests
        environment: 'node',

        // Only look for test files matching these patterns
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],

        // Exclude node_modules and build folders
        exclude: ['node_modules', '.next', 'dist'],
    },

    resolve: {
        alias: {
            // This maps `@/` to your `src/` folder
            // So you can write: import { calculateSGPA } from '@/lib/gpa-calculations'
            '@': path.resolve(__dirname, './src'),
        },
    },
})
