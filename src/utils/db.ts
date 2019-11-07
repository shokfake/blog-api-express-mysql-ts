import { createConnection, Connection, ConnectionOptions } from 'typeorm';

export function getConnectionOptions(): ConnectionOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || '',
    password: process.env.DB_PWD || '',
    database: process.env.DB_NAME || '',
    entities: [`${__dirname}/../entities/*.ts`],
    synchronize: true
  };
}

export function getConnection(): Promise<Connection> {
  const opts: ConnectionOptions = getConnectionOptions();
  return createConnection(opts);
}
