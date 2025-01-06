import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {StrictMode} from "react";

import installOpenTelemetry from "./otel-config.ts";
// import {bootstrapFlagD} from "./utils/feature-flags/features.ts";

installOpenTelemetry();
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

// race condition - flagD won't have a valid flag value for the promise type until


// // it gets the
// bootstrapFlagD().then(() => {
//     createRoot(document.getElementById('root')!).render(
//         <StrictMode>
//             <App />
//         </StrictMode>
//     );
// });

