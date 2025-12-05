import { Config } from "jest";

const SINGLETHREADED =
    process.env.SINGLETHREADED === "1" || process.env.SINGLETHREADED === "true";
const options: Config = {
    transform: {
        "^.+\\.ts": "@swc/jest",
    },
    testEnvironment: "node",
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

if (SINGLETHREADED) {
    /** setting value to undfined throws */
    options.maxWorkers = 1;
}

module.exports = options;
