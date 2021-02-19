import * as mysql from 'mysql2/promise';

class DatabaseConnector {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_URL,
      port: Number.parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_SCHEMA,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log(`[INFO] Database connection pool for ${process.env.MYSQL_URL}:${process.env.MYSQL_PORT} successfully created`);
  }

  public async query(query: string): Promise<any> {
    return await this.pool.query(query);
  }
}

export default new DatabaseConnector();