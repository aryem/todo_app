import { Router } from 'express';
import auth from './routes/auth';
import todo from './routes/todo';

export default () => {
    const app = Router();
    auth(app);
    todo(app);
    return app
}