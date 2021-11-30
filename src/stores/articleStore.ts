import Contributor from "../contributor";
import { ISection } from "./sectionStore";

export interface IArticle {
  headline: string;
  contributors: Contributor[];
  creationDate: Date;
  imageUrl?: string;
  featured?: boolean;
  section: ISection;
}

class ArticleStore {
  private articles: IArticle[] = [];

  getArticles() {
    return this.articles;
  }

  setArticles(articles: IArticle[]) {
    this.articles = articles;
  }

  addArticle(article: IArticle) {
    this.articles.push(article);
  }
}

export default new ArticleStore();
