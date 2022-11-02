import { BASE_URL, axios, validateStatusCode } from "./utils";
import {
  IWriter,
  IArticle,
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
  section,
  preview,
  imageUrl,
  driveFileId,
  featured,
}: ArticleData) => {
  const postData: any = {
    content,
    writer_id: writerId,
    section,
    featured: featured ?? false,
  };
  if (preview) postData.preview = preview;
  if (imageUrl) postData.imageUrl = imageUrl;
  if (driveFileId) postData.driveFileId = driveFileId;
  const response = await axios.post<IArticle>(`${BASE_URL}/articles`, postData);

  return validateStatusCode(response);
};

export const getFeaturedArticle = async () => {
  const response = await axios.get<IArticle>(`${BASE_URL}/articles/featured`);

  const article = validateStatusCode(response);

  article.publicationDate = new Date(article.publicationDate);

  return article;
};

export const updateArticleById = async (
  id: number,
  toChange: {
    writerId?: number;
    sectionId?: number;
    body?: ArticleContent;
    imageUrl?: string;
    featured?: boolean;
  },
) => {
  const response = await axios.patch<void>(
    `${BASE_URL}/articles/${id}`,
    toChange,
  );

  return validateStatusCode(response);
};

export const deleteArticleById = async (id: number) => {
  const response = await axios.delete<void>(`${BASE_URL}/articles/${id}`);

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

export const uploadPicture = async (picture: File) => {
  const formData = new FormData();
  formData.append("picture", picture);

  const response = await axios.post<void>(
    `${BASE_URL}/upload_picture`,
    formData,
  );

  validateStatusCode(response);
  return response.headers["location"];
};

export const postWriter = async ({
  firstName,
  lastName,
  title,
  bio,
  imageUrl,
}: {
  firstName: string;
  lastName: string;
  title: string;
  bio?: string;
  imageUrl?: string;
}) => {
  const postData: any = {
    firstName,
    lastName,
    title,
  };

  if (bio) postData.bio = bio;
  if (imageUrl) postData.imageUrl = imageUrl;

  const response = await axios.post<IWriter>(`${BASE_URL}/writers`, postData);

  return validateStatusCode(response);
};
