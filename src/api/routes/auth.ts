import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from "winston";
import { Container } from 'typedi';
import { AuthService } from "../../services/auth.service";

const registerValidation = celebrate({
    body: Joi.object().keys({
        username: Joi.string().required().error(new Error("username is required and has to be text!")),
        password: Joi.string().required().error(new Error("password is required and has to be text!"))
    })
});

const route = Router();

export default function AuthRoute(app: Router) {
    app.use(route);

    route.post('/register', registerValidation, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling register endpoint with body: %o', req.body);
        try {
            const authServiceInstance = Container.get(AuthService);
            const { username, token } = await authServiceInstance.register(req.body);
            return res.status(201).json({ username, token });
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    })

    route.post('/login', registerValidation, async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling register endpoint with body: %o', req.body);
        try {
            const authServiceInstance = Container.get(AuthService);
            const { token } = await authServiceInstance.login(req.body);
            return res.status(200).json({ token });
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    })
}
