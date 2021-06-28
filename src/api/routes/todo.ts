import { NextFunction, Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import Container from "typedi";
import { Logger } from "winston";
import TodoService from "../../services/todo.service";
import middleware from "../middleware";
import validate from "../middleware/validation";

const route = Router();

const createTodoSchemaValidation = checkSchema({
    title: {
        in: 'body',
        notEmpty: {
            errorMessage: 'title is missing',
        }
    },
    description: {
        in: 'body',
        optional: true,
        isString: {
            errorMessage: 'Description must be string'
        }
    },
    isActive: {
        in: 'body',
        optional: true,
        isBoolean: {
            errorMessage: 'isActive must be boolean'
        }
    }
});

const updateTodoSchemaValidation = checkSchema({
    id: {
        in: ['body', 'params'],
        notEmpty: {
            errorMessage: 'id is required'
        },
        toInt: true
    },
    title: {
        in: 'body',
        notEmpty: {
            errorMessage: 'title is missing',
        }
    },
    description: {
        in: 'body',
        optional: true,
        isString: {
            errorMessage: 'Description must be string'
        }
    },
    isActive: {
        in: 'body',
        optional: true,
        isBoolean: {
            errorMessage: 'isActive must be boolean'
        }
    }
});

const idValidationSchema = checkSchema({
    id: {
        in: 'params',
        isInt: {
            errorMessage: 'id must be integer'
        },

    }
});

export default function TodoRoute(app: Router) {
    app.use('/todos', route);

    route.get('/', middleware.isAuth, middleware.attachCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            logger.debug('Calling get all todos');
            const todoService = Container.get(TodoService);
            const todos = await todoService.getAll();
            return res.status(200).json({ todos });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.get('/:id', validate(idValidationSchema), middleware.isAuth, middleware.attachCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            const idParam = req.params.id;
            logger.debug(`Calling get todo by id:${idParam}`);
            const todoService = Container.get(TodoService);
            const todo = await todoService.getById(parseInt(idParam, 10));
            return res.status(200).json({ todo });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.post('/', validate(createTodoSchemaValidation), middleware.isAuth, middleware.attachCurrentUser, createTodoSchemaValidation, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            logger.debug('calling create todo with body: %o', req.body);
            const todoService = Container.get(TodoService);
            const todoId = await todoService.create(req.body);
            return res.status(201).json({ id: todoId });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.put('/:id', validate(updateTodoSchemaValidation), middleware.isAuth, middleware.attachCurrentUser, updateTodoSchemaValidation, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            const idParam = req.params.id;
            logger.debug('calling update todo with body: %o', req.body);
            const todoService = Container.get(TodoService);
            const todoId = await todoService.update(parseInt(idParam, 10), req.body);
            return res.status(200).json({ id: todoId });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
    route.delete("/:id", validate(idValidationSchema), middleware.isAuth, middleware.attachCurrentUser, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            const idParam = req.params.id;
            logger.debug("calling delete todo with id: %o", idParam);
            const todoService = Container.get(TodoService);
            const id = await todoService.delete(parseInt(idParam, 10));
            res.status(200).json({ id });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    });
}