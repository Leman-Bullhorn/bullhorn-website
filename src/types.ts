import React from "react";

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
  sectionId: number;
  preview?: string;
  imageUrl?: string;
  driveFileId?: string;
}

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
  content: ArticleContent;
  writer: IWriter;
  section: ISection;
  publicationDate: Date;
  preview: string;
  imageUrl: string;
  driveFileId?: string;
  featured?: boolean;
}

export interface ISection {
  id: number;
  name: string;
  permalink: string;
}

export enum AuthRole {
  Admin = "Admin",
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
  textAlignment: React.CSSProperties["textAlign"];
  spans: ArticleSpan[];
}

export interface ArticleContent {
  headline: string;
  paragraphs: ArticleParagraph[];
}
