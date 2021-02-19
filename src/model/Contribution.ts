class Contribution {
  private username: string;
  private repository: string;
  private owner: string;
  private commits: number;
  private added: number;
  private removed: number;

  constructor(username: string, repository: string, owner: string, commits: number = 0, added: number = 0, removed: number = 0) {
    this.username = username;
    this.repository = repository;
    this.owner = owner;
    this.commits = commits;
    this.added = added;
    this.removed = removed;
  }

  public getUsername = () => this.username;
  public getRepository = () => this.repository;
  public getOwner = () => this.owner;
  public getCommits = () => this.commits;
  public getAdded = () => this.added;
  public getRemoved = () => this.removed;

  public incrementCommits = () => {
    this.commits += 1;
  }
  public addAdded = (amount: number) => {
    this.added += amount;
  }
  public addRemoved = (amount: number) => {
    this.removed += amount;
  }
}

export default Contribution;