import TodoModel from "../models/todo";
import UserModel from "../models/user";
import dependencyInjector from "./dependencyInjector";
import expressLoader from "./express";
import LoggerInstance from "./logger";
import SequelizeConnection from "./sequelize";

export default async function Loader({ expressApp }) {
    const sequelizeConnection = await SequelizeConnection();
    LoggerInstance.info('Sequelize connected');

    const userModel = {
        name: 'userModel',
        model: UserModel
    };
    const todoModel = {
        name: 'todoModel',
        model: TodoModel
    };
    await dependencyInjector({
        sequelizeConnection,
        models:[
            userModel,
            todoModel
        ]
    });
    await expressLoader({ app: expressApp });
    LoggerInstance.info('Express loaded')
}