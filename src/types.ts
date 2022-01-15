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
  body: string;
  writer: IWriter;
  publicationDate: Date;
  imageUrl: string;
  featured?: boolean;
  preview: string;
  section?: ISection;
}

export interface ISection {
  name: string;
  route: string;
}
