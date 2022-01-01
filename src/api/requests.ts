import { BASE_URL, axios } from "./utils";
import { IWriter, IArticle } from "../types";

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
