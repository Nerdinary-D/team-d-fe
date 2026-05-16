import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/\\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|shadow|divide|placeholder|caret|accent)-\\[#[0-9a-fA-F]{3,8}\\]/]",
          message:
            "Do not use arbitrary hex color classes. Add the color to src/app/globals.css as a design token and use the token class instead.",
        },
        {
          selector:
            "TemplateElement[value.raw=/\\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|shadow|divide|placeholder|caret|accent)-\\[#[0-9a-fA-F]{3,8}\\]/]",
          message:
            "Do not use arbitrary hex color classes. Add the color to src/app/globals.css as a design token and use the token class instead.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
