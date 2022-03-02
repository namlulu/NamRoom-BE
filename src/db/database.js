import { config } from '../config.js';
import SQ from 'sequelize';

const { host, user, database, password, port } = config.db;
const { type } = config.version;
export let sequelize = null;

if (type === 'HEROKU') {
  sequelize = new SQ.Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: false,
  });
}
