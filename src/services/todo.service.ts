import { ModelCtor } from "sequelize/types";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { TodoCreationAttributes, TodoInstance } from "../models/todo";

@Service()
export default class TodoService {
    constructor(@Inject('todoModel') private todoModel: ModelCtor<TodoInstance>, @Inject("logger") private logger: Logger) { }

    public async getById(id: number) {
        try {
            const todo = await this.todoModel.findByPk(id);
            return todo;
        } catch (error) {
            this.logger.error(error);
        }
    }
    public async getAll() {
        try {
            const todos = await this.todoModel.findAll();
            return todos;
        } catch (error) {
            this.logger.error(error);
        }
    }
    public async create(todoCreate: TodoCreationAttributes) {
        try {
            const todo = await this.todoModel.create(todoCreate);
            return todo.id;
        } catch (error) {
            this.logger.error(error);
        }
    }
    public async update(id: number, todoUpdate: TodoCreationAttributes) {
        try {
            await this.todoModel.update({
                id: todoUpdate.id,
                title: todoUpdate.title,
                isActive: todoUpdate.isActive,
                description: todoUpdate.description
            }, { where: { id } });
            return id;
        } catch (error) {
            this.logger.error(error);
        }
    }
    public async delete(id: number) {
        try {
            const rows = await this.todoModel.destroy({ where: { id } });
            if (!rows) {
                throw new Error("Todo Not found");
            } else {
                return id;
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}