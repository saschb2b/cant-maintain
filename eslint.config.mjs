import eslint from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

const eslintConfig = [
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs", "next.config.mjs"],
        },
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
