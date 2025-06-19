import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/client";
import "./index.scss";
import { SnackbarProvider } from 'notistack';

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <StrictMode>
    <QueryClientProvider client={queryClient}>
          <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      // 你可以自定义样式
      // classes={{ variantSuccess: 'joy-success', ... }}
    >


      <App />
    </SnackbarProvider>
    </QueryClientProvider>
    // </StrictMode>
  );
}
