import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from "winston";
import { AuthService } from "../../services/auth.service";
import validate from '../middleware/validation';
const { validationResult, checkSchema } = require('express-validator');

const registerValidation = checkSchema({
    username: {
        in: 'body',
        notEmpty: {
            errorMessage: 'username is missing',
        },
        isString: {
            errorMessage: 'username must be string'
        },
    },
    password: {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one special character, and one number",
    }
});

const loginValidation = checkSchema({
    username: {
        in: 'body',
        errorMessage: 'Email is missing',
        isString: true,
        notEmpty: true
    },
    password: {
        in: 'body',
        errorMessage: 'Password is missing',
        isString: true,
        notEmpty: true
    }
});

const route = Router();

export default function AuthRoute(app: Router) {
    app.use(route);

    route.post('/register', validate(registerValidation), async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            logger.debug('Calling register endpoint with body: %o', req.body);
            const authServiceInstance = Container.get(AuthService);
            const { username, token } = await authServiceInstance.register(req.body);
            return res.status(201).json({ username, token });
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    })

    route.post('/login', validate(loginValidation), async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        try {
            logger.debug('Calling register endpoint with body: %o', req.body);
            const authServiceInstance = Container.get(AuthService);
            const { token } = await authServiceInstance.login(req.body);
            return res.status(200).json({ token });
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    })
}
