export default class Contributor {
  constructor(private firstName: string, private lastName: string) {}

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getHyphenatedName(): string {
    return `${this.firstName}-${this.lastName}`;
  }
}
