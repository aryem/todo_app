import { ModelCtor } from 'sequelize/types';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { UserInstance } from '../../models/user';


const attachCurrentUser = async (req, res, next) => {
  const Logger : Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as ModelCtor<UserInstance>;
    const userRecord = await UserModel.findByPk(req.token);
    if (!userRecord) {
      return res.status(401);
    }
    const currentUser = userRecord.toJSON();
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    return next();
  } catch (error) {
    Logger.error('Error attaching user to req: %o', error);
    return next(error);
  }
};

export default attachCurrentUser;