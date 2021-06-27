import { ModelCtor } from 'sequelize/types';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { UserInstance } from '../../models/user';


const attachCurrentUser = async (req, res, next) => {
  const Logger : Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as ModelCtor<UserInstance>;
    Logger.silly('Find user record by id: %d', req.token['id']);
    const userRecord = await UserModel.findByPk(req.token['id']);
    if (!userRecord) {
      return res.status(401).end();
    }
    const currentUser = userRecord.toJSON();
    Logger.silly('Current user: %o', currentUser);
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    return next();
  } catch (error) {
    Logger.error('Error attaching user to req: %o', error);
    return next(error);
  }
};

export default attachCurrentUser;