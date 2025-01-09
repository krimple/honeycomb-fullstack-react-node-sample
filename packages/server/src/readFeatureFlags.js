const {FlagdProvider} = require("@openfeature/flagd-provider");
const {OpenFeature} = require('@openfeature/server-sdk');

OpenFeature.setProvider(
    new FlagdProvider({
        host: process.env.FLAGD_HOST,
        port: process.env.FLAGD_PORT,
        tls: false
    })
)

const openFeatureClient = OpenFeature.getClient();

module.exports = { openFeatureClient };
