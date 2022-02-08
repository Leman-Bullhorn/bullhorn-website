import { articleStore } from "../stores/articleStore";
import { authStore } from "../stores/authStore";
import { sectionsStore } from "../stores/sectionStore";
import { writersStore } from "../stores/writerStore";
import { AuthRole } from "../types";
import * as raw from "./requests";
import { parseJwt } from "./utils";

export const getWriterByName = async (hyphenateName: string) => {
  let writer = writersStore
    .getWriters()
    .find(writer => `${writer.firstName}-${writer.lastName}` === hyphenateName);

  if (writer) {
    return writer;
  }
  try {
    const writer = await raw.getWriterByName(hyphenateName);

    writersStore.addWriter(writer);
    return writer;
  } catch (e) {
    return undefined;
  }
};

export const getArticlesByWriterId = async (writerId: number) => {
  try {
    const articles = await raw.getArticlesByWriterId(writerId);
    articles.forEach(articleStore.addArticle);

    return articles;
  } catch (e) {
    return [];
  }
};

export const getArticles = async (limit?: number) => {
  try {
    const articles = await raw.getArticles(limit);
    articles.forEach(articleStore.addArticle);

    return articles;
  } catch (e) {
    return [];
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const article = await raw.getArticleBySlug(slug);
    articleStore.addArticle(article);

    return article;
  } catch (e) {
    return undefined;
  }
};

export const getSections = async () => {
  try {
    const sections = await raw.getSections();
    sectionsStore.setSections(sections);

    return sections;
  } catch (e) {
    return [];
  }
};

export const login = async (username: string, password: string) => {
  const loginAndStore = async () => {
    try {
      const { accessToken } = await raw.login(username, password);
      authStore.setAccessToken(accessToken);

      let { role } = parseJwt<{ role: AuthRole; exp: number }>(accessToken);
      authStore.setRole(role);
    } catch (e) {
      authStore.reset();
    }
  };

  let currentAccessToken = authStore.getAccessToken();

  if (currentAccessToken) {
    let parsedJwt =
      parseJwt<{ role: AuthRole; exp: number }>(currentAccessToken);
    // if the token is expired
    if (parsedJwt.exp <= new Date().getUTCSeconds()) {
      await loginAndStore();
    }
    // if the access token is still valid no need to do anything
    return;
  }

  await loginAndStore();
};
