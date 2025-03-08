export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.jest.json" },
    ],
    "^.+\\.(svg|png)$": "<rootDir>/__mocks__/img-mock.cjs",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "^sinon$": "sinon",
    '^@index/(.*)$': '<rootDir>/$1/'
  },
};
