const globals = require("globals");
const js = require("@eslint/js");
const stylistic = require("@stylistic/eslint-plugin-js");

module.exports = [
    {
        ignores: [
            "base64.js",
            "browser-polyfill.js",
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es6,
                ...globals.jquery,
                ...globals.webextensions,
            },
            parserOptions: {
                ecmaVersion: 2020,
            },
        },
        plugins: {
            stylistic: stylistic,
        },
        rules:{
            ...js.configs.recommended.rules,
            "no-restricted-syntax": [
                "error",
                "ForInStatement",
            ],
            "no-unused-vars": [
                "error",
                {
                    "args": "all",
                    "argsIgnorePattern": "^_[^_]",
                    "varsIgnorePattern": "^_[^_]",
                },
            ],
            "no-var": "error",
            "prefer-const": "error",
            "stylistic/array-bracket-newline": [
                "error",
                "consistent",
            ],
            "stylistic/array-bracket-spacing": [
                "error",
                "never",
            ],
            "stylistic/comma-dangle": [
                "error",
                {
                    "arrays": "always-multiline",
                    "exports": "always-multiline",
                    "functions": "only-multiline",
                    "imports": "always-multiline",
                    "objects": "always-multiline",
                },
            ],
            "stylistic/indent": [
                "error",
                4,
                {
                    "SwitchCase": 1,
                },
            ],
            "stylistic/linebreak-style": [
                "error",
                "unix",
            ],
            "stylistic/no-console": [
                "off",
            ],
            "stylistic/object-curly-spacing": [
                "error",
                "never",
            ],
            "stylistic/quotes": [
                "error",
                "double",
            ],
            "stylistic/semi": [
                "error",
                "always",
            ],
        },
    },
];
