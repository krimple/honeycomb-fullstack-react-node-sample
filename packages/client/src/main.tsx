import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {StrictMode} from "react";

import installOpenTelemetry from "./otel-config.ts";

installOpenTelemetry();
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
