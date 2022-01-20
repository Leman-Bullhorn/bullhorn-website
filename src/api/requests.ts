import { BASE_URL, axios } from "./utils";
import { IWriter, IArticle, ISection } from "../types";

export const getWriterByName = async (hyphenateName: string) => {
  let response = await axios.get<IWriter>(
    `${BASE_URL}/writers/${hyphenateName}`,
  );

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
