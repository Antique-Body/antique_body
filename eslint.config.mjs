import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ignores = [
  "node_modules",
  ".next",
  "build",
  "dist",
  "out",
  "coverage",
  "*.log",
  ".DS_Store",
  ".env*",
  "public",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
  "*.tsbuildinfo",
  "/prisma/migrations/",
  "*.config.js",
  "*.config.mjs",
  "next.config.mjs",
  "postcss.config.mjs",
  "tailwind.config.js",
];

const eslintConfig = [
  {
    ignores,
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-undef": "error",
      "no-irregular-whitespace": "error",

      // React
      "react/prop-types": "off", // Not needed with TypeScript
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": ["error", { ignore: ["jsx"] }],

      // JSX
      "jsx-quotes": ["error", "prefer-double"],

      // Import
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // ES6
      "arrow-body-style": ["error", "as-needed"],
      // Removed arrow-parens rule as it's causing issues
    },
  },
];

export default eslintConfig;
