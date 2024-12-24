module.exports = {
  env: {
    node: true, // Node.js global variables
    es2021: true, // Modern ES features
  },
  parser: "@typescript-eslint/parser", // Specify the TypeScript parser
  parserOptions: {
    ecmaVersion: 2021, // Allows modern ECMAScript features
    sourceType: "module", // Allows using ES modules
  },
  plugins: ["@typescript-eslint", "prettier"], // Add TypeScript and Prettier plugins
  extends: [
    "eslint:recommended", // Use recommended ESLint rules
    "plugin:@typescript-eslint/recommended", // Use recommended TypeScript rules
    "plugin:prettier/recommended", // Enable Prettier integration
  ],
  rules: {
    // Custom rules
    "prettier/prettier": "error", // Show Prettier issues as errors
    "@typescript-eslint/no-unused-vars": ["error"], // Disallow unused variables
    "@typescript-eslint/no-explicit-any": "warn", // Warn about `any` usage
    "no-console": "off", // Allow console logs
  },
};
