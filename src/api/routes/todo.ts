import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { Logger } from "winston";
import TodoService from "../../services/todo.service";
import middleware from "../middleware";

const route = Router();

const createTodoSchemaValidation = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().error(new Error("title is required and has to be text!")),
        description: Joi.string(),
        isActive: Joi.boolean()
    })
});
const updateTodoSchemaValidation = celebrate({
    body: Joi.object().keys({
        id: Joi.number().required(),
        title: Joi.string().required().error(new Error("title is required and has to be text!")),
        description: Joi.string(),
        isActive: Joi.boolean()
    })
});

export default function TodoRoute(app: Router) {
    app.use('/todos', route);

    route.get('/', middleware.isAuth, middleware.attachCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling get all todos');
        try {
            const todoService = Container.get(TodoService);
            const todos = await todoService.getAll();
            return res.status(200).json({ todos });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.get('/:id', middleware.isAuth, middleware.attachCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        const idParam = req.params.id;
        logger.debug(`Calling get todo by id:${idParam}`);
        try {
            const todoService = Container.get(TodoService);
            const todo = await todoService.getById(parseInt(idParam, 10));
            return res.status(200).json({ todo });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.post('/', middleware.isAuth, middleware.attachCurrentUser, createTodoSchemaValidation, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('calling create todo with body: %o', req.body);
        try {
            const todoService = Container.get(TodoService);
            const todoId = await todoService.create(req.body);
            return res.status(201).json({ id: todoId });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.put('/:id', middleware.isAuth, middleware.attachCurrentUser, updateTodoSchemaValidation, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        const idParam = req.params.id;
        logger.debug('calling update todo with body: %o', req.body);
        try {
            const todoService = Container.get(TodoService);
            const todoId = await todoService.update(parseInt(idParam, 10), req.body);
            return res.status(200).json({ id: todoId });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.delete(":/id", middleware.isAuth, middleware.attachCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        const idParam = req.params.id;
        logger.debug("calling delete todo with id: %o", idParam);
        try {
            const todoService = Container.get(TodoService);
            await todoService.delete(parseInt(idParam, 10));
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
}