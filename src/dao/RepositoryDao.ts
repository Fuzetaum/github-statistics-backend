import DatabaseConnector from './DatabaseConnector';

import Repository from "../model/Repository";

class RepositoryDao {
  public async createNew(name: string, owner: string): Promise<void> {
    await DatabaseConnector.query(`INSERT INTO repository (name, owner) VALUES ('${name}', '${owner}')`);
  }

  public async getRepositoryData(name: string, owner: string): Promise<Repository> {
    const response = await DatabaseConnector.query(`SELECT * FROM repository WHERE name='${name}' AND owner='${owner}';`);
    if (response && response[0] && response[0].length > 0) {
      return new Repository(response[0][0].name, response[0][0].owner, response[0][0].fully_loaded === 1, response[0][0].currentCursor || null);
    }
    return null;
  }

  public async updateRepositorySearchData(newData: Repository): Promise<void> {
    await DatabaseConnector.query(`UPDATE repository SET fully_loaded='${newData.isFullyLoaded() ? '1' : '0'}'${newData.getCursor() === null ? '' : `, currentCursor='${newData.getCursor()}'`} WHERE name='${newData.getName()}' AND owner='${newData.getOwner()}'`);
  }
}

export default RepositoryDao;