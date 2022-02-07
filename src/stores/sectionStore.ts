import { getSections } from "../api/requests";
import { ISection } from "../types";

class SectionsStore {
  private sections = new Set<ISection>();

  getSections() {
    return Array.from(this.sections);
  }

  setSections(sections: ISection[]) {
    this.sections = new Set(sections);
  }

  // If the section is already present then the addition is ignored
  addSection(section: ISection) {
    this.sections.add(section);
  }

  async getSectionsOrRequest() {
    if (this.sections.size === 0) {
      let sections = await getSections();
      this.setSections(sections);
      return Array.from(this.sections);
    } else {
      return Array.from(this.sections);
    }
  }
}

export const sectionsStore = new SectionsStore();
