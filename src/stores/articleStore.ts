import { IArticle } from "../types";

class ArticleStore {
  private articles = new Set<IArticle>();

  getArticles() {
    return Array.from(this.articles);
  }

  setArticles(articles: IArticle[]) {
    this.articles = new Set(articles);
  }

  // If the article is already present then the addition is ignored
  addArticle(article: IArticle) {
    this.articles.add(article);
  }
}

export const articleStore = new ArticleStore();
