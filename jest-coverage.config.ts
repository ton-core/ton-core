import { Config } from "jest";

const mainConfig = require("./jest.config");

const config: Config = {
    ...mainConfig,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "html"],
    collectCoverageFrom: ["src/**/*.{ts,js}"],
};

module.exports = config;
