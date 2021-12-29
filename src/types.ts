export interface IWriter {
  firstName: string;
  lastName: string;
}

export interface IArticle {
  headline: string;
  writers: IWriter[];
  creationDate: Date;
  imageUrl?: string;
  featured?: boolean;
  section: ISection;
}

export interface ISection {
  name: string;
  route: string;
}
