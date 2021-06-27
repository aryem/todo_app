import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ModelCtor } from 'sequelize/types';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import config from '../config';
import { UserCreationAttributes, UserInstance } from '../models/user';

@Service()
export class AuthService {
    private readonly _salyRounds = 12;
    constructor(@Inject('userModel') private userModel: ModelCtor<UserInstance>, @Inject("logger") private logger: Logger) { }

    public async register({ username, password }: UserCreationAttributes) {
        try {
            this.logger.silly('Hashing password');
            const hash = await bcrypt.hash(password, this._salyRounds);
            this.logger.silly('Create db record');
            const user = await this.userModel.create({ username: username, password: hash });
            this.logger.silly('Generating JWT');
            const token = this.generateAccessToken(user);
            return { username: user.username, token };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async login({ username, password }: UserCreationAttributes) {
        try {
            const user = await this.userModel.findOne({ where: { username } });
            // TODO: User not found
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            // TODO: password not valid
            const token = this.generateAccessToken(user);
            return { token };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async verifyToken(token: string) {
        try {
            const userToken = jwt.verify(token, config.get('jwt.secret'));
            const user = await this.userModel.findByPk(userToken['id']);
            return user !== null;
        } catch (error) {
            this.logger.error(error);
        }

    }

    private generateAccessToken(user: UserInstance) {
        return jwt.sign({
            id: user.id,
            username: user.username
        }, config.get('jwt.secret'));
    }
}

