const {
  aliasDangerous,
  configPaths,
} = require("react-app-rewire-alias/lib/aliasDangerous");

module.exports = aliasDangerous(configPaths("./tsconfig.paths.json"));
