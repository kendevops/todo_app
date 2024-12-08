import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext.tsx";
import { Toaster } from "@/components/ui/toaster";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <TodoProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </TodoProvider>
    </AuthProvider>
  </StrictMode>
);
