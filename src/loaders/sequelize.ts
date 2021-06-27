import { Sequelize } from 'sequelize'
import config from '../config';
import LoggerInstance from './logger';

export const sequelize = new Sequelize(config.get('db.name'), config.get('db.user'), config.get('db.password'), {
    dialect: 'postgres',
    host: config.get('db.host'),
    logging: LoggerInstance.debug.bind(LoggerInstance)
});

export default async function SequelizeConnection() {
    await sequelize.authenticate();
    return sequelize;
}