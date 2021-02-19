import * as express from 'express';
import * as cors from 'cors';
import GitHubService from '../service/GitHubService';

class RestController {
  private app: express.Express;
  private port: number;
  private gitHubService: GitHubService;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.gitHubService = new GitHubService("linux", "torvalds");
  }

  public initialize(): void {
    this.app.use(cors({ optionsSuccessStatus: 200 }));
    this.startStatisticsCollection();
    this.getRepositoryStatistics();
    this.app.listen(this.port, () => {
      console.log(`[INFO] Listening on port ${this.port}`);
    });
  }

  private getRepositoryStatistics(): void {
    this.app.get('/statistics', async (req, res) => {
      const { repository, owner } = req.query;
      if (!repository || !owner) {
        console.error('[ERROR] Statistics collection rejected: "repository" or "owner" query parameters not found');
        res.status(400).json({
          status: 'error',
          reason: '"repository" or "owner" query parameters not found'
        });
      }
      console.log(`[INFO] Collecting current statistics at ${new Date(Date.now()).toDateString()}`);
      res.json(await this.gitHubService.getRepositoryStatistics(repository.toString(), owner.toString()));
    });
  }

  private startStatisticsCollection(): void {
    this.app.put('/statistics', (req, res) => {
      const { repository, owner } = req.query;
      if (!repository || !owner) {
        console.error('[ERROR] Statistics collection rejected: "repository" or "owner" query parameters not found');
        res.status(400).json({
          status: 'error',
          reason: '"repository" or "owner" query parameters not found'
        });
      }

      this.gitHubService.startStatisticsCollection(repository.toString(), owner.toString())
        .then(result => {
          console.log(`[INFO] Starting statistics collection for repository "${repository}"`);
          res.status(200).json(result);
        })
        .catch(error => res.status(500).json({ error }));
    });
  }
}

export default new RestController(Number.parseInt(process.env.PORT));
