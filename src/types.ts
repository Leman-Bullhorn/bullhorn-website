export interface IWriter {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  title: string;
}

export interface IArticle {
  id: number;
  headline: string;
  slug: string;
  body: string;
  writer: IWriter;
  publicationDate: Date;
  imageUrl: string;
  featured?: boolean;
  preview: string;
  section: ISection;
}

export interface ISection {
  id: number;
  name: string;
  permalink: string;
}
