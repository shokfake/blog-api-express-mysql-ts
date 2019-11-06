import { createConnection, Connection, ConnectionOptions } from 'typeorm';

// eslint-disable-next-line import/prefer-default-export
export function getConnection(): Promise<Connection> {
  const opts: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || '',
    password: process.env.DB_PWD || '',
    database: process.env.DB_NAME || '',
    entities: [`${__dirname}/entity/*.js`],
    synchronize: true
  };
  return createConnection(opts);
}
