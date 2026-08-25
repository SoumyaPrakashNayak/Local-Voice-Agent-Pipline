import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { MockStateProvider } from "./mockServices/MockStateContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MockStateProvider>
      <App />
    </MockStateProvider>
  </StrictMode>
);
