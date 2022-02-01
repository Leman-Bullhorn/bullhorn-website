import { IWriter } from "../types";

class WritersStore {
  private writers: IWriter[] = [];

  getWriters() {
    return this.writers;
  }

  setWriters(writers: IWriter[]) {
    this.writers = writers;
  }

  addWriter(writer: IWriter) {
    this.writers.push(writer);
  }
}

export const writersStore = new WritersStore();
