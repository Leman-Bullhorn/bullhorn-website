export interface IContributor {
  firstName: string;
  lastName: string;
}

export interface IArticle {
  headline: string;
  contributors: IContributor[];
  creationDate: Date;
  imageUrl?: string;
  featured?: boolean;
  section: ISection;
}

export interface ISection {
  name: string;
  route: string;
}
