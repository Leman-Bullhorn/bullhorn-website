import { IArticle } from "../types";

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
