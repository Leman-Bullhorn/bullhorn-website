import { BASE_URL, axios, validateStatusCode } from "./utils";
import { IWriter, IArticle, ISection, AuthRole } from "../types";

export const getWriterByName = async (hyphenateName: string) => {
  const response = await axios.get<IWriter>(
    `${BASE_URL}/writers/${hyphenateName}`,
  );

  return validateStatusCode(response);
};

export const getArticlesByWriterId = async (writerId: number) => {
  const response = await axios.get<IArticle[]>(
    `${BASE_URL}/writers/${writerId}/articles`,
  );

  return validateStatusCode(response);
};

export const getArticles = async (limit?: number) => {
  const response = await axios.get<IArticle[]>(`${BASE_URL}/articles`, {
    params: {
      limit: limit ?? 10,
    },
  });

  return validateStatusCode(response);
};

export const getArticleBySlug = async (slug: string) => {
  const response = await axios.get<IArticle>(`${BASE_URL}/articles/${slug}`);

  return validateStatusCode(response);
};

export const getSections = async () => {
  const response = await axios.get<ISection[]>(`${BASE_URL}/sections`);

  return validateStatusCode(response);
};

export const login = async (username: string, password: string) => {
  const response = await axios.post<AuthRole>(`${BASE_URL}/login`, {
    username,
    password,
  });

  return validateStatusCode(response);
};

export const current = async () => {
  const response = await axios.get<AuthRole>(`${BASE_URL}/current`);

  return validateStatusCode(response);
};
