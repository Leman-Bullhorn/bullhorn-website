export interface IWriter {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  title: string;
}

export interface IArticle {
  headline: string;
  writers: IWriter[];
  creationDate: Date;
  imageUrl?: string;
  featured?: boolean;
  preview?: string;
  section: ISection;
}

export interface ISection {
  name: string;
  route: string;
}
