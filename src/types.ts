import React from "react";

export enum Section {
  News = "news",
  Opinions = "opinions",
  Features = "features",
  Science = "science",
  Sports = "sports",
  Arts = "arts",
  Humor = "humor",
}

export const sections = [
  {
    id: Section.News,
    display: "News",
  },
  {
    id: Section.Opinions,
    display: "Opinions",
  },
  {
    id: Section.Features,
    display: "Features",
  },
  {
    id: Section.Science,
    display: "Science",
  },
  {
    id: Section.Sports,
    display: "Sports",
  },
  {
    id: Section.Arts,
    display: "Arts & Entertainment",
  },
  {
    id: Section.Humor,
    display: "Humor",
  },
];

export interface Paginated<T> {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
  content: T;
}

export interface IApiError {
  timestamp: string;
  status: number;
  message: string;
}

export interface ArticleData {
  content: ArticleContent;
  writerId: number;
  section: Section;
  focus: string;
  imageUrl?: string;
  driveFileId?: string;
  featured?: boolean;
}

export interface IWriter {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  title?: string;
  imageUrl?: string;
}

export interface IArticle {
  id: number;
  headline: string;
  slug: string;
  content: ArticleContent;
  writer: IWriter;
  section: Section;
  publicationDate: Date;
  focus: string;
  imageUrl: string;
  driveFileId?: string;
  featured: boolean;
}

export enum AuthRole {
  Admin = "Admin",
  Editor = "Editor",
  Default = "Default",
}

export interface LoginInfo {
  username: string;
  password: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  authorName: string;
  authorEmail: string;
  authorPicture: string;
}

type SpanContent =
  | { text: { content: string } }
  | { anchor: { href: string; content: string } }
  | { image: { src: string; width: string; height: string; alt: string } };

export interface ArticleSpan {
  content: SpanContent[];
  fontStyle: string;
  textDecoration: string;
  color: string;
  fontWeight: string;
}

export interface ArticleParagraph {
  marginLeft: React.CSSProperties["marginLeft"];
  marginRight: React.CSSProperties["marginRight"];
  textAlignment: React.CSSProperties["textAlign"];
  textIndent: React.CSSProperties["textIndent"];
  spans: ArticleSpan[];
}

export interface ArticleContent {
  headline: string;
  paragraphs: ArticleParagraph[];
}
