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
            const user = await this.userModel.findOne({ where: { username } });
            if (user) {
                this.logger.error('username already exist %s', username);
                throw new Error("Username already exits");
            } else {
                const newUser = await this.userModel.create({ username: username, password: hash });
                this.logger.silly('Generating JWT');
                const token = this.generateAccessToken(newUser);
                return { username: newUser.username, token };
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async login({ username, password }: UserCreationAttributes) {
        try {
            const user = await this.userModel.findOne({ where: { username } });
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Password is invalid');
            }
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

