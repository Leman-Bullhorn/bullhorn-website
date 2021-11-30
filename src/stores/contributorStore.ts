import Contributor from "../contributor";

class ContributorStore {
  private contributors: Contributor[] = [];

  getContributors() {
    return this.contributors;
  }

  setContributors(contributors: Contributor[]) {
    this.contributors = contributors;
  }

  addContributor(contributor: Contributor) {
    this.contributors.push(contributor);
  }
}

export default new ContributorStore();
