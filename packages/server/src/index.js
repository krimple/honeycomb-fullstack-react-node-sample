// TODO - add feature flags for server side if needed
// this is incomplete
// const {configureFlagD} = require("./readFeatureFlags.js");

const { startServer } = require('./server');
(async () => {
    // await configureFlagD();
    startServer();
})();
