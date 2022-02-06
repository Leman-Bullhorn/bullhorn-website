import { BASE_URL, axios, parseJwt } from "./utils";
import { IWriter, IArticle, ISection, AuthRole } from "../types";
import { authStore } from "../stores/authStore";

export const getWriterByName = async (hyphenateName: string) => {
  let response = await axios.get<IWriter>(
    `${BASE_URL}/writers/${hyphenateName}`,
  );

  return response.data;
};

export const getArticleBySlug = async (slug: string) => {
  let response = await axios.get<IArticle>(`${BASE_URL}/articles/${slug}`);

  return response.data;
};

export const getArticlesByWriterId = async (writerId: number) => {
  let response = await axios.get<IArticle[]>(
    `${BASE_URL}/writers/${writerId}/articles`,
  );
  return response.data;
};

export const getArticles = async (limit?: number) => {
  let response = await axios.get<IArticle[]>(`${BASE_URL}/articles`, {
    params: {
      limit: limit ?? 10,
    },
  });

  return response.data;
};

export const getSections = async () => {
  let response = await axios.get<ISection[]>(`${BASE_URL}/sections`);

  return response.data;
};

export const login = async (username: string, password: string) => {
  let response = await axios.post<{ accessToken: string }>(
    `${BASE_URL}/login`,
    { username, password },
  );

  authStore.setAccessToken(response.data.accessToken);

  let parsedJwt = parseJwt<{ role: AuthRole; exp: number }>(
    response.data.accessToken,
  );
  authStore.setRole(parsedJwt.role);
};
