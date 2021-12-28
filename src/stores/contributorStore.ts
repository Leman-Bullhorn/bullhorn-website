import { IContributor } from "../types";

class ContributorStore {
  private contributors: IContributor[] = [];

  getContributors() {
    return this.contributors;
  }

  setContributors(contributors: IContributor[]) {
    this.contributors = contributors;
  }

  addContributor(contributor: IContributor) {
    this.contributors.push(contributor);
  }
}

export default new ContributorStore();
