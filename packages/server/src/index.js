// TODO - add feature flags for server side if needed
// this is incomplete
// const {configureFlagD} = require("./readFeatureFlags.js");

const { startServer } = require('./server');
// DAD, WHEN ARE WET GOING TO GET THERE?
// "SON, LATER, AWAIT SOME PROMISES"
(async () => {
    // await configureFlagD();
    startServer();
})();
