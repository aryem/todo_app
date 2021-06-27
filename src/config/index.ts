import convict from "convict";
import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
    // This error should crash whole process
    throw new Error("Couldn't find .env file");
}

const config = convict({
    env: {
        doc: 'The application environment',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'The port to bind',
        format: 'port',
        default: 3000,
        env: 'PORT',
        arg: 'port'
    },
    jwt: {
        secret: {
            doc: 'The jwt token secret',
            format: String,
            default: '42e35d7e029d5e265b6b95b66fe9de06',
            env: 'JWT_SECRET'
        }
    },
    db: {
        host: {
            doc: 'Database host name/IP',
            fotmat: '*',
            default: 'localhost',
            env: 'POSTGRES_HOSTNAME'
        },
        name: {
            doc: 'Database name',
            format: String,
            default: 'database',
            env: 'POSTGRES_DB'
        },
        user: {
            doc: 'Database username',
            format: String,
            default: 'root',
            env: 'POSTGRES_USER'
        },
        password: {
            doc: 'Database password',
            format: String,
            default: 'password',
            env: 'POSTGRES_PASSWORD'
        }
    },
    logs: {
        level: {
            doc: 'The logger level',
            format: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'],
            default: 'silly',
            env: 'LOG_LEVEL'
        }
    }
});

config.validate({ allowed: 'strict' });

console.log(config.getProperties());

export default config;