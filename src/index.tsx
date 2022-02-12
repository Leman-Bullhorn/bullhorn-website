import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { lightTheme } from "./theme";
import { GlobalStyles } from "./global";
import { HomePage } from "./pages/homePage";
import { WriterPage } from "./pages/writerPage";
import { NotFoundPage } from "./pages/notFoundPage";

import { ArticlePage } from "./pages/articlePage";
import { AdminPage } from "./pages/adminPage";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writer/:writerName" element={<WriterPage />} />
            <Route path="/article/:section/:slug" element={<ArticlePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
