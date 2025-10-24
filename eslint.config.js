import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";

export default defineConfig([
    globalIgnores(["dist", "src/components/ui"]),
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            js,
            tseslint,
            reactHooks,
            reactRefresh,
        },
        extends: [
            "js/recommended",
            "tseslint/recommended",
            "reactHooks/recommended-latest",
            "reactRefresh/vite",
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
]);
