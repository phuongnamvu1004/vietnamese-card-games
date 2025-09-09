/** @type {import('ts-jest').JestConfigWithTsJest} **/
const config = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
export default config;
