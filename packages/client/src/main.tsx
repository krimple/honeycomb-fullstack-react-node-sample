import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Observability from "./Observability";
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Observability />
      <App />
    </StrictMode>
)
