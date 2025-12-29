import type { Config } from "jest"

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",

    testMatch: [
        "**/tests/**/*.spec.ts",
        "**/tests/**/*.test.ts",
    ],

    transform: {
        "^.+\\.ts$": "ts-jest",
    },

    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
}

export default config
