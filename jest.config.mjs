import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Caminho do projeto Next.js
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Trata imports de CSS tradicionais
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
};

export default createJestConfig(customJestConfig);