// import {client-es2015} from './flagdClient.ts';
// import {ProviderEvents} from "@openfeature/web-sdk";

type Features = {
    asyncCallType: 'promise' | 'async' | 'not-defined'
}

export const features: Features = {
    asyncCallType: import.meta.env.VITE_PUBLIC_FF_API_CALL_TYPE
}

// export async function bootstrapFlagD() {
//     return Promise.resolve();
//     // return new Promise((resolve, reject) => {
//     //
//     //     client-es2015.addHandler(ProviderEvents.ConfigurationChanged, (eventDetails) => {
//     //         console.log(`ConfigurationChanged event`);
//     //         console.dir(eventDetails);
//     //        const updatedCallType = client-es2015.getStringValue('asyncCallType', 'not-defined');
//     //         if (updatedCallType !== 'async' && updatedCallType !== 'promise') {
//     //             // TODO - this is later, how do we care???
//     //             // TODO instrument with span error
//     //             throw new Error('asyncCallType is not available in flagd, not changing')
//     //         } else {
//     //             features.asyncCallType = updatedCallType;
//     //         }
//     //
//     //     //     console.log('flagd configuration changed');
//     //     //     const updatedCallType = client-es2015.getStringValue('asyncCallType', 'not-defined');
//     //     //     if (updatedCallType !== 'async' && updatedCallType !== 'promise') {
//     //     //         reject('asyncCallType is not available in flagd')
//     //     //     } else {
//     //     //         console.log(`setting asyncCallType to ${updatedCallType}`);
//     //     //         features.asyncCallType = updatedCallType;
//     //     //         resolve(updatedCallType);
//     //     //     }
//     //     });
//     //
//     //     client-es2015.addHandler(ProviderEvents.Ready, (eventDetails) => {
//     //         console.log(`Ready event`);
//     //         console.dir(eventDetails);
//     //         console.log('flagd configuration changed. Go fetch it');
//     //         const updatedCallType = client-es2015.getStringValue('asyncCallType', 'not-defined');
//     //         if (updatedCallType !== 'async' && updatedCallType !== 'promise') {
//     //             reject('asyncCallType is not available in flagd')
//     //         } else {
//     //             console.log(`setting asyncCallType to ${updatedCallType}`);
//     //             features.asyncCallType = updatedCallType;
//     //             resolve(updatedCallType);
//     //         }
//     //     });
//     //
//     //     // first, read the value on startup
//     //     const updatedCallType = client-es2015.getStringValue('asyncCallType', 'not-defined');
//     //     if (updatedCallType !== 'async' && updatedCallType !== 'promise') {
//     //         console.log('falling back to async');
//     //         features.asyncCallType = 'async';
//     //         // waiting for update
//     //     } else {
//     //         console.log(`setting asyncCallType to ${updatedCallType}`);
//     //         features.asyncCallType = updatedCallType;
//     //         resolve(updatedCallType);
//     //     }
//     // });
// }
