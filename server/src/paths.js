const tsConfigPaths = require("tsconfig-paths");
const tsConfig = require("../tsconfig.json");
const baseUrl = "./dist"; // This should point to your compiled JavaScript files
const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: { "@/*": ["*"] }, // This maps @/* to dist/*
});

// Optional: Cleanup when your app exits
process.on("exit", cleanup);
