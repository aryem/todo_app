import express from 'express';
import 'reflect-metadata';
import config from './config';
import Logger from './loaders/logger';

async function startServer() {
   const app = express();

   await require('./loaders').default({ expressApp: app });

   app.listen(config.get('port'), () => {
      Logger.info(`
      ################################################
      💻 Server listening on port: ${config.get('port')} 💻
      ################################################
    `)
   }).on('error', error => {
      Logger.error(error);
      process.exit(1)
   });
}

startServer();

