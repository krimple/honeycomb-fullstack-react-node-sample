import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Observability from "./Observability";
import {StrictMode} from "react";

console.log(`Reloading ${new Date().toString()}`);
// note: removed StrictMode to avoid double-rendering in dev
// for the otel demo
createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Observability />
      <App />
    </StrictMode>
)
