import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {StrictMode} from "react";
//import setupO11y from './otel-config';

// avoid double-render problem by wiring up the Honeycomb OpenTelemetry Web SDK
// outside of a render process
//setupO11y();

createRoot(document.getElementById('root')!).render(

    <StrictMode>
      <App />
    </StrictMode>
)
