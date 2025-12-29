import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import github from "eslint-plugin-github";
import jest from "eslint-plugin-jest";

export default [
  {
    ignores: ["dist/", "node_modules/", "coverage/"],
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["**/*.test.ts", "**/__tests__/**"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      github: github,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...typescriptEslint.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["**/*.test.ts", "**/__tests__/**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      jest: jest,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      ...jest.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
