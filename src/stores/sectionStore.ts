import { ISection } from "../types";

class SectionsStore {
  private sections: ISection[] = [];

  getSections() {
    return this.sections;
  }

  setSections(sections: ISection[]) {
    this.sections = sections;
  }

  addSection(section: ISection) {
    this.sections.push(section);
  }
}

export default new SectionsStore();
