module.exports = {
  env: {
    browser: true,
    jest: true,
    es5: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-typescript",
    "standard-with-typescript",
    "plugin:react/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "prettier"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/prefer-optional-chain": "error",
    "react/jsx-props-no-spreading": "off",
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "next*/**",
            group: "builtin",
            position: "before",
          },
        ],
        distinctGroup: false,
        pathGroupsExcludedImportTypes: ["next", "react"],
        groups: [
          ["type", "builtin", "external"],
          ["internal", "parent", "sibling", "index"],
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["."],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      },
    },
  },
  ignorePatterns: ["try-on-api-*"], // ignoring Cosium try-on-api-* files
};
