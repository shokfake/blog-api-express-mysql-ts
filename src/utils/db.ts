import { createConnection, Connection } from 'typeorm';

// eslint-disable-next-line import/prefer-default-export
export function getConnection(): Promise<Connection> {
  return createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/entity/*.js`],
    synchronize: true
  });
}
