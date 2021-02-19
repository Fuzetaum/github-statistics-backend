import DatabaseConnector from './DatabaseConnector';
import Contribution from "../model/Contribution";

class ContributionDao {
  public async createNew(contribution: Contribution): Promise<void> {
    await DatabaseConnector.query(`INSERT INTO contribution (username, repository, owner, commits, added, removed) VALUES ('${contribution.getUsername()}', '${contribution.getRepository()}', '${contribution.getOwner()}', '${contribution.getCommits()}', '${contribution.getAdded()}', '${contribution.getRemoved()}')`);
  }

  public async getContributionData(username: string, repository: string, owner: string): Promise<Contribution> {
    const response = await DatabaseConnector.query(`SELECT * FROM contribution WHERE username='${username}' AND repository='${repository}' AND owner='${owner}'`);
    if (response && response[0] && response[0].length > 0) {
      return new Contribution(username, repository, owner, response[0][0].commits, response[0][0].added, response[0][0].removed);
    }
    return null;
  }

  public async getAllRepositoryContributions(repository: string, owner: string): Promise<Array<Contribution>> {
    const response = await DatabaseConnector.query(`SELECT * FROM contribution WHERE repository='${repository}' AND owner='${owner}'`);
    return response[0].map((contribution: any) => new Contribution(contribution.username, repository, owner, contribution.commits, contribution.added, contribution.removed));
  }

  public async update(newData: Contribution): Promise<void> {
    await DatabaseConnector.query(`UPDATE contribution SET commits='${newData.getCommits()}', added='${newData.getAdded()}', removed='${newData.getRemoved()}' WHERE username='${newData.getUsername()}' AND repository='${newData.getRepository()}' AND owner='${newData.getOwner()}'`);
  }
}

export default ContributionDao;