import {OpenFeature} from '@openfeature/web-sdk';
import {FlagdWebProvider} from "@openfeature/flagd-web-provider";

// TODO - configure TLS - currently hardcoded to false
const host = import.meta.env.VITE_PUBLIC_FLAGD_HOST;
const port = import.meta.env.VITE_PUBLIC_FLAGD_PORT;

OpenFeature.setProvider(
    new FlagdWebProvider({
        host: host,
        port: port,
        tls: false,
    })
);

export const client = OpenFeature.getClient();

// TODO Remove
// @ts-expect-error this is for debugging / experimenting with API and temporary
window['client'] = client;
