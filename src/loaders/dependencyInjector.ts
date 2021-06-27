import { Sequelize } from 'sequelize/types';
import { Container } from 'typedi';
import LoggerInstance from './logger';

export default async function dependencyInjector({ sequelizeConnection, models }: { sequelizeConnection: Sequelize, models: { name: string, model: any }[] }) {
    try {
        models.forEach(m => {
            Container.set(m.name, m.model);
        });

        Container.set('logger', LoggerInstance);
    } catch (error) {
        LoggerInstance.error('Error on dependency injector loader: ', error);
    }
}