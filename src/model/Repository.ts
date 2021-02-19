class Repository {
  public name: string;
  public owner: string;
  public fullyLoaded: boolean;
  public cursor: string;

  constructor(name: string, owner: string, fullyLoaded: boolean = false, cursor: string = null) {
    this.name = name;
    this.owner = owner;
    this.fullyLoaded = fullyLoaded;
    this.cursor = cursor;
  }

  public getName = () => this.name;
  public getOwner = () => this.owner;
  public getCursor = () => this.cursor;
  public isFullyLoaded = () => this.fullyLoaded;

  public setFullyLoaded(fullyLoaded: boolean): void {
    this.fullyLoaded = fullyLoaded;
  }
  public setCursor(cursor: string): void {
    this.cursor = cursor;
  }
}

export default Repository;