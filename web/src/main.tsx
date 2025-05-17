import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import "./index.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/client';

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
