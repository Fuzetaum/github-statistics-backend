import ContributionDao from '../dao/ContributionDao';
import GithubUserDao from '../dao/GithubUserDao';
import RepositoryDao from '../dao/RepositoryDao';

import Contribution from '../model/Contribution';
import Repository from '../model/Repository';

import { post } from '../util/RequestUtil';

class GitHubService {
  private repository: string;
  private owner: string;
  private contributionDao: ContributionDao;
  private githubUserDao: GithubUserDao;
  private repositoryDao: RepositoryDao;

  constructor(repository: string, owner: string) {
    this.repository = repository;
    this.owner = owner;
    this.contributionDao = new ContributionDao();
    this.githubUserDao = new GithubUserDao();
    this.repositoryDao = new RepositoryDao();
  }

  public async getRepositoryStatistics(name: string, owner: string): Promise<object> {
    return {
      success: true,
      data: {
        fullyLoaded: (await this.repositoryDao.getRepositoryData(name, owner)).isFullyLoaded(),
        contributors: (await this.contributionDao.getAllRepositoryContributions(name, owner)).map((contribution: Contribution) => ({
          username: contribution.getUsername(),
          commits: contribution.getCommits(),
          added: contribution.getAdded(),
          removed: contribution.getRemoved(),
          }
        )),
      },
    };
  }

  public async startStatisticsCollection(name: string, owner: string): Promise<object> {
    let success: boolean = false;
    let reason: string = '';
    let created: boolean = false;

    if (!await this.githubUserDao.userExists(owner))
      this.githubUserDao.createNew(owner);

    const response: Repository = await this.repositoryDao.getRepositoryData(name, owner);
    if (response === null) {
      this.repositoryDao.createNew(name, owner);
      console.log(`[INFO] Registered new repository "${name}" from user "${owner}"`);
      this.createNewStatisticsCollectionPromise(name, owner);
      success = true;
      created = true;
    } else {
      console.log(`[INFO] Continuing data collection for repository "${name}" from user "${owner}"`);
      this.createNewStatisticsCollectionPromise(name, owner, response.getCursor());
      success = true;
      created = false;
    }

    return {
      success,
      reason,
      created,
    };
  }

  private createNewStatisticsCollectionPromise(name: string, owner: string, cursor: string = null): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const body = {
        query: this.getQueryString(cursor),
        variables: {},
      };
      let retryAttempt: number = 0;
      const maxRetries: number = Number.parseInt(process.env.MAX_RETRY_ATTEMPTS);
  
      while (retryAttempt < maxRetries) {
        try {
          const response = await post('https://api.github.com/graphql', body);
          if (!response || !response.data || !response.data.data || !response.data.data.repository || !response.data.data.repository.object || !response.data.data.repository.object.history)
            throw new Error('object "history" was not present in the response (maybe the request failed?)');
          const { edges, nodes } = response.data.data.repository.object.history;
    
          if (!nodes) throw new Error('object "nodes" was not present in the response (maybe the request failed?)');
          for (let node of nodes) {
            if (node.author.user != null) {
              if (!await this.githubUserDao.userExists(node.author.user.login)) await this.githubUserDao.createNew(node.author.user.login);

              let contribution: Contribution = await this.contributionDao.getContributionData(node.author.user.login, name, owner);
              let exists: boolean = true;
              if (!contribution) {
                contribution = new Contribution(node.author.user.login, name, owner);
                exists = false;
              }
              contribution.incrementCommits();
              contribution.addAdded(node.additions);
              contribution.addRemoved(node.deletions);
              if (exists) await this.contributionDao.update(contribution);
              else await this.contributionDao.createNew(contribution);
            }
          }

          if (!!edges && edges.length > 0) {
            this.repositoryDao.updateRepositorySearchData(new Repository(name, owner, false, edges.slice(-1)[0].cursor));
            this.createNewStatisticsCollectionPromise(name, owner, edges.slice(-1)[0].cursor);
          } else this.repositoryDao.updateRepositorySearchData(new Repository(name, owner, true, null));
          resolve(undefined);
          break;
        } catch (error) {
          if (retryAttempt < (maxRetries - 1)) {
            console.warn(`[WARN] Request #${retryAttempt + 1} failed. Trying again`);
            retryAttempt++;
          }
          else {
            console.error(`[ERROR] Failed to collect repository data: ${error}`);
            reject();
            break;
          }
        }
      }
    });
  }

  private getQueryString(cursor: string = null) {
    return `query {
      repository(name:"${this.repository}" owner:"${this.owner}"){
        name
        defaultBranchRef {
          id
        }
        object(expression: "master") {
          ... on Commit {
            oid
            history(first: 100, ${cursor === null ? '' : `after:"${cursor}", `}since: "2020-01-01T00:00:00Z", until:"2020-12-31T23:59:59Z") {
              edges {
                cursor
              }
              totalCount
              nodes {
                author {
                  user {
                    login
                  }
                }
                additions
                deletions
              }
            }
          }
        }
      }
    }`;
  }
}

export default GitHubService;