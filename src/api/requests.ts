import { BASE_URL, axios, validateStatusCode } from "./utils";
import { IWriter, IArticle, ISection, AuthRole } from "../types";
import { AxiosResponse } from "axios";

const articlesReturnFunction = (response: AxiosResponse<IArticle[], any>) => {
  return () => {
    response.data.map(
      article => (article.publicationDate = new Date(article.publicationDate)),
    );
    return response.data;
  };
};

const articleReturnFunction = (response: AxiosResponse<IArticle, any>) => {
  return () => {
    response.data.publicationDate = new Date(response.data.publicationDate);
    return response.data;
  };
};

export const getWriters = async () => {
  const response = await axios.get<IWriter[]>(`${BASE_URL}/writers`);

  return validateStatusCode(response);
};

export const postArticle = async (
  headline: string,
  body: string,
  writerId: number,
  sectionId: number,
  preview?: string,
  imageUrl?: string,
) => {
  const postData: any = {
    headline,
    body,
    writer_id: writerId,
    section_id: sectionId,
  };
  if (preview) postData.preview = preview;
  if (imageUrl) postData.imageUrl = imageUrl;
  const response = await axios.post<IArticle>(`${BASE_URL}/articles`, postData);

  return validateStatusCode(response);
};

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

  return validateStatusCode(response, articlesReturnFunction(response));
};

export const getArticles = async (limit?: number) => {
  const response = await axios.get<IArticle[]>(`${BASE_URL}/articles`, {
    params: {
      limit: limit ?? 10,
    },
  });

  return validateStatusCode(response, articlesReturnFunction(response));
};

export const getArticleBySlug = async (slug: string) => {
  const response = await axios.get<IArticle>(`${BASE_URL}/articles/${slug}`);

  return validateStatusCode(response, articleReturnFunction(response));
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
