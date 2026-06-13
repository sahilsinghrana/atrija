import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        requestAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        localStorage: "readonly",
        IntersectionObserver: "readonly",
        HTMLElement: "readonly",
        SVGElement: "readonly",
        Event: "readonly",
        MouseEvent: "readonly",
      },
    },
    rules: {
      "astro/no-conflict-set-directives": "error",
      "astro/no-unused-define-vars-in-style": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "no-useless-escape": "warn",
      "no-empty": "warn",
    },
  },
  {
    // Scene files: browser-only, allow var
    files: ["src/js/scene/**/*.js", "src/js/scene-init.js"],
    rules: {
      "no-var": "off",
      "prefer-const": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    ignores: [
      "dist/",
      "node_modules/",
      "public/",
      ".astro/",
      "src/content/validate-content.js",
      "src/tests/",
      "src/env.d.ts",
      // Layout files have known parser issues with </head> boundary
      "src/layouts/**/*.astro",
    ],
  },
];
