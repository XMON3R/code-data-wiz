import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";

/**
 * ESLint "Flat" Configuration File
 * @see https://eslint.org/docs/latest/use/configure/migration-guide
 *
 * This new configuration format is exported as an array of objects.
 * Each object represents a set of rules applied to specific files.
 */
export default [
  // 1. Global Configuration
  // This object applies to all files matched.
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
      },
      globals: {
        ...globals.browser, // Enable browser global variables (window, document, etc.)
        ...globals.node,    // Enable Node.js global variables
      },
    },
    // Settings shared across plugins
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },

  // 2. Base ESLint Recommended Rules
  pluginJs.configs.recommended,

  // 3. TypeScript-Specific Configuration
  // Uses the 'typescript-eslint' plugin to apply TypeScript rules.
  ...tseslint.configs.recommended,

  // 4. React-Specific Configuration
  pluginReactConfig, // Base recommended rules from eslint-plugin-react

  // 5. React Hooks Plugin Configuration
  {
    plugins: { "react-hooks": hooksPlugin },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },

  // 6. React Refresh Plugin Configuration (for Vite)
  {
    plugins: { "react-refresh": refreshPlugin },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  
  // 7. Custom Rules and Overrides
  // Add any project-specific rules here.
  {
    rules: {
      // It's common to turn this off in modern React projects using Vite/Next.js
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // Often disabled in TypeScript projects
    },
  },

  // 8. Ignore Files
  // This replaces the old .eslintignore file.
  {
    ignores: ["dist", "node_modules", ".eslintrc.cjs"],
  },
];