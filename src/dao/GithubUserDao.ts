import DatabaseConnector from './DatabaseConnector';

class GithubUserDao {
  public async createNew(username: string): Promise<void> {
    await DatabaseConnector.query(`INSERT INTO github_user (username) VALUES ('${username}')`);
  }

  public async userExists(username: string): Promise<boolean> {
    const response = await DatabaseConnector.query(`SELECT * FROM github_user WHERE username='${username}'`);
    return response && response[0] && response[0].length > 0;
  }
}

export default GithubUserDao;