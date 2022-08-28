import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  // modulePathIgnorePatterns: ["<rootDir>/src/tests/"],
};
export default config;
