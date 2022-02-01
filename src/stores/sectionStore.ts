import { getSections } from "../api/requests";
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

  async getSectionsOrRequest() {
    if (this.sections.length === 0) {
      let sections = await getSections();
      this.setSections(sections);
      return this.sections;
    } else {
      return this.sections;
    }
  }
}

export const sectionsStore = new SectionsStore();
