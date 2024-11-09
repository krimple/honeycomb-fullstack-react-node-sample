import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Observability from "./Observability";

// note: removed StrictMode to avoid double-rendering in dev
// for the otel demo
createRoot(document.getElementById('root')!).render(
    <>
      <Observability />
      <App />
    </>
)
