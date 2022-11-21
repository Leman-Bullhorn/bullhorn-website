import "./index.scss";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { lightTheme } from "./theme";
import { GlobalStyles } from "./global";
import { HomePage } from "./pages/homePage";
import { WriterPage } from "./pages/writerPage";
import { NotFoundPage } from "./pages/notFoundPage";
import { ArticlePage } from "./pages/articlePage";
import { AdminPage } from "./pages/adminPage";
import ScrollToTop from "./components/scrollToTop";
import { SignOutButton } from "./components/signOutButton";
import { Footer } from "./components/footer";
import { SectionPage } from "./pages/sectionPage";
import { StaffPage } from "./pages/staffPage";

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (container == null) {
  throw new Error("Couldn't find root element");
}
const root = createRoot(container);

root.render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <QueryClientProvider client={queryClient}>
        <SignOutButton />
        <ReactQueryDevtools />
        <GlobalStyles />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writer/:writerName" element={<WriterPage />} />
            <Route path="/article/:section/:slug" element={<ArticlePage />} />
            <Route path="/section/:sectionId" element={<SectionPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
