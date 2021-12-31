import "./index.scss";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { lightTheme } from "./theme";
import { GlobalStyles } from "./global";
import HomePage from "./pages/homePage";
import WriterPage from "./pages/writerPage";
import NotFoundPage from "./pages/notFoundPage";
import sectionsStore from "./stores/sectionStore";
import { ISection } from "./types";
import React from "react";

const sections: ISection[] = [
  {
    route: "science",
    name: "Science",
  },
  {
    route: "news",
    name: "News",
  },
  {
    route: "features",
    name: "Features",
  },
  {
    route: "opinions",
    name: "Opinions",
  },
  {
    route: "ae",
    name: "Arts & Entertainment",
  },
  {
    route: "humor",
    name: "Humor",
  },
  {
    route: "sports",
    name: "Sports",
  },
];
sectionsStore.setSections(sections);

// const articles: IArticle[] = [
//   {
//     id: 1,
//     headline: "Featured Article",
//     body: "This is a test body",
//     writer: writerStore.getWriters()[0],
//     publicationDate: new Date(Date.now() - 24 * 60 * 30 * 60000),
//     imageUrl:
//       "https://ichef.bbci.co.uk/news/976/cpsprodpb/13F00/production/_95146618_bills.jpg",
//     featured: false,
//     section: sectionsStore.getSections()[0],
//     preview:
//       "Stuyvesant Model UN hosted MiniMUNC, their first in-person conference since the beginning of the pandemic",
//   },
//   {
//     id: 2,
//     headline: "Random Article",
//     body: "This is a test body",
//     writer: writerStore.getWriters()[0],
//     publicationDate: new Date(Date.now() - 1 * 60000),
//     section: sectionsStore.getSections()[1],
//     preview:
//       "Stuyvesant Model UN hosted MiniMUNC, their first in-person conference since the beginning of the pandemic",
//   },
//   {
//     id: 3,
//     headline: "Random Article 2",
//     body: "This is a test body",
//     writer: writerStore.getWriters()[1],
//     imageUrl:
//       "https://ichef.bbci.co.uk/news/976/cpsprodpb/13F00/production/_95146618_bills.jpg",
//     publicationDate: new Date(Date.now() - 60 * 60000),
//     section: sectionsStore.getSections()[2],
//     preview:
//       "Stuyvesant Model UN hosted MiniMUNC, their first in-person conference since the beginning of the pandemic",
//   },
//   {
//     id: 4,
//     headline: "Maybe this column should be opinions?",
//     body: "This is a test body",
//     writer: writerStore.getWriters()[0],
//     publicationDate: new Date(Date.now() - 30 * 60000),
//     section: sectionsStore.getSections()[3],
//   },
// ];
// articleStore.setArticles(articles);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writer/:writerName" element={<WriterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
