module.exports = {
  roots: ["<rootDir>/api"],
  testMatch: ["**/*.spec.(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
