import { BASE_URL, axios, validateStatusCode } from "./utils";
import {
  IWriter,
  IArticle,
  ISection,
  AuthRole,
  LoginInfo,
  ArticleData,
  Paginated,
  DriveFile,
  ArticleContent,
} from "../types";
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

export const postArticle = async ({
  content,
  writerId,
  sectionId,
  preview,
  imageUrl,
}: ArticleData) => {
  const postData: any = {
    content,
    writer_id: writerId,
    section_id: sectionId,
  };
  if (preview) postData.preview = preview;
  if (imageUrl) postData.imageUrl = imageUrl;
  const response = await axios.post<IArticle>(`${BASE_URL}/articles`, postData);

  return validateStatusCode(response);
};

export const getWriterById = async (id: number) => {
  const response = await axios.get<IWriter>(`${BASE_URL}/writers/${id}`);
  return validateStatusCode(response);
};

export const updateWriterById = async (
  id: number,
  toChange: {
    firstName?: string;
    lastName?: string;
    title?: string;
    bio?: string;
  },
) => {
  const response = await axios.patch<void>(
    `${BASE_URL}/writers/${id}`,
    toChange,
  );

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

export const getArticles = async (page: number = 1, limit: number = 10) => {
  const response = await axios.get<Paginated<IArticle[]>>(
    `${BASE_URL}/articles`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  const articles = validateStatusCode(response);

  articles.content.forEach(
    article => (article.publicationDate = new Date(article.publicationDate)),
  );

  return articles;
};

export const getArticleBySlug = async (slug: string) => {
  const response = await axios.get<IArticle>(`${BASE_URL}/articles/${slug}`);

  return validateStatusCode(response, articleReturnFunction(response));
};

export const getSections = async () => {
  const response = await axios.get<ISection[]>(`${BASE_URL}/sections`);

  return validateStatusCode(response);
};

export const login = async ({ username, password }: LoginInfo) => {
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

export const getDrafts = async () => {
  const response = await axios.get<DriveFile[]>(`${BASE_URL}/drive/drafts`);

  return validateStatusCode(response);
};

export const getFinals = async () => {
  const response = await axios.get<DriveFile[]>(`${BASE_URL}/drive/finals`);

  return validateStatusCode(response);
};

export const moveToFinal = async (fileId: string) => {
  const response = await axios.post<DriveFile>(
    `${BASE_URL}/drive/final/${fileId}`,
  );

  return validateStatusCode(response);
};

export const moveToDraft = async (fileId: string) => {
  const response = await axios.post<DriveFile>(
    `${BASE_URL}/drive/draft/${fileId}`,
  );

  return validateStatusCode(response);
};

export const getArticleContent = async (fileId: string) => {
  const response = await axios.get<ArticleContent>(
    `${BASE_URL}/drive/content/${fileId}`,
  );

  return validateStatusCode(response);
};
