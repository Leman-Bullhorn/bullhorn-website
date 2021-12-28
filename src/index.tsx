import "./index.scss";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { lightTheme } from "./theme";
import { GlobalStyles } from "./global";
import HomePage from "./pages/homePage";
import NotFoundPage from "./pages/notFoundPage";
import sectionsStore from "./stores/sectionStore";
import articleStore from "./stores/articleStore";
import { IContributor, ISection, IArticle } from "./types";
import contributorStore from "./stores/contributorStore";

const contributors: IContributor[] = [
  {
    firstName: "Max",
    lastName: "Glass",
  },
  {
    firstName: "Jasper",
    lastName: "Dratt",
  },
];
contributorStore.setContributors(contributors);

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

const articles: IArticle[] = [
  {
    headline: "Featured Article",
    contributors: contributorStore.getContributors(),
    creationDate: new Date(Date.now() - 24 * 60 * 30 * 60000),
    imageUrl:
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/13F00/production/_95146618_bills.jpg",
    featured: false,
    section: sectionsStore.getSections()[0],
  },
  {
    headline: "Random Article",
    contributors: [contributorStore.getContributors()[0]],
    creationDate: new Date(Date.now() - 1 * 60000),
    section: sectionsStore.getSections()[1],
  },
  {
    headline: "Random Article 2",
    contributors: [contributorStore.getContributors()[0]],
    imageUrl:
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/13F00/production/_95146618_bills.jpg",
    creationDate: new Date(Date.now() - 60 * 60000),
    section: sectionsStore.getSections()[2],
  },
  {
    headline: "Maybe this column should be opinions?",
    contributors: [contributorStore.getContributors()[0]],
    creationDate: new Date(Date.now() - 30 * 60000),
    section: sectionsStore.getSections()[3],
  },
];
articleStore.setArticles(articles);

ReactDOM.render(
  <ThemeProvider theme={lightTheme}>
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  </ThemeProvider>,
  document.getElementById("root"),
);
