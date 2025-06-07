import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/client";
// import "@radix-ui/themes/styles.css";
import "./index.css";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    // </StrictMode>
  );
}
