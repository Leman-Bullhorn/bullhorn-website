import { IWriter } from "../types";

class WritersStore {
  private writers = new Set<IWriter>();

  getWriters() {
    return Array.from(this.writers);
  }

  setWriters(writers: IWriter[]) {
    this.writers = new Set(writers);
  }

  // If the writer is already present then the addition is ignored
  addWriter(writer: IWriter) {
    this.writers.add(writer);
  }
}

export const writersStore = new WritersStore();
