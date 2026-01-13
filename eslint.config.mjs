import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rule overrides for personal project
  {
    rules: {
      // Allow `any` type in code (strict typing is good but not blocking)
      "@typescript-eslint/no-explicit-any": "warn",
      // Don't error on unused variables, just warn
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow @ts-ignore comments (needed for some Next.js edge cases)
      "@typescript-eslint/ban-ts-comment": "off",
      // Allow unescaped quotes in JSX (readability > strictness)
      "react/no-unescaped-entities": "off",
      // Allow require() imports (used in some config files)
      "@typescript-eslint/no-require-imports": "off",
      // Non-null assertions after optional chain (edge case)
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      // React hooks purity (flags shadcn/ui generated code)
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;

