import { Sequelize } from 'sequelize';

const db_host = process.env.DB_HOST || 'db';
const db_port = +(process.env.DB_PORT || 5432);
const db_user = process.env.DB_USER || '';
const db_pass = process.env.DB_PASS || '';
const db_name = process.env.DB_NAME || '';

const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  port: db_port,
  dialect: 'postgres',
});

export default sequelize;
