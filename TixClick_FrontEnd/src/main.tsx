import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { LanguageProvider } from "./pages/organizer/components/LanguageContext.tsx";
import { SidebarProvider } from "./contexts/SideBarContext.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    {/* <StrictMode> */}
    <Provider store={store}>
      <AuthProvider>
        <LanguageProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </LanguageProvider>
      </AuthProvider>
    </Provider>
    {/* </StrictMode> */}
  </BrowserRouter>
);
