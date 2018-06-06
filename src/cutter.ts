import * as moment from 'moment';
import {sync as globSync} from 'glob';
import {getLogger} from 'log4js';
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const logger = getLogger();

interface AppJSON {
  name: string,
  error_file: string,
  out_file: string,
  instance: number,
  loop?: number
}

logger.level = 'INFO';

const mkdir = (parentPath): string => {
  const dateStr: string = moment().format('YYYY-MM-DD');
  const dirName: string = dateStr;
  const pathExist: boolean = fs.existsSync(parentPath);
  const logsDir: boolean = fs.existsSync(`${parentPath}/${dirName}`);

  if (!pathExist) {
    throw new Error('Path is not existed!');
  }

  if (!logsDir) {
    fs.mkdirSync(`${parentPath}/${dirName}`);
  }

  return dateStr;
};

const createPromise = (oldName, newName) => {
  return new Promise((resolve, reject) => {
    const exsit = fs.existsSync(oldName);

    if (exsit) {
      fs.rename(oldName, newName, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    } else {
      logger.info(`The specify logs file don't exist!`);
      resolve();
    }
  }).then().catch(e => {
    logger.error(e);
  });
};

const rename = async (apps) => {

  const renamePromiseArr = [];
  apps.map(async (app: AppJSON) => {
    const instance: number = app.instance;
    const parentPath: string = path.dirname(app.out_file);
    const outAppName: string = path.basename(app.out_file, '.log');
    const errAppName: string = path.basename(app.error_file, '.log');
    const date = await mkdir(parentPath);

    if (instance !== 1) {
      for (let i = 1; i <= instance; i++) {
        const oldErrorLog: string = `${parentPath}/${errAppName}-${i}.log`;
        const newErrorLog: string = `${parentPath}/${date}/${errAppName}-error-${i}.log`;
        const oldOutLog: string = `${parentPath}/${outAppName}-${i}.log`;
        const newOutLog: string = `${parentPath}/${date}/${outAppName}-out-${i}.log`;

        const errorLog = createPromise(oldErrorLog, newErrorLog);
        const outLog = createPromise(oldOutLog, newOutLog);

        renamePromiseArr.push(errorLog);
        renamePromiseArr.push(outLog);
      }
    } else {
      const oldErrorLog: string = `${parentPath}/${errAppName}-error.log`;
      const newErrorLog: string = `${parentPath}/${date}/${errAppName}-error.log`;
      const oldOutLog: string = `${parentPath}/${outAppName}.log`;
      const newOutLog: string = `${parentPath}/${date}/${outAppName}-out.log`;

      const errorLog = createPromise(oldErrorLog, newErrorLog);
      const outLog = createPromise(oldOutLog, newOutLog);

      renamePromiseArr.push(errorLog);
      renamePromiseArr.push(outLog);
    }

    await delExpiredLog(app);
  });

  await Promise.all(renamePromiseArr);
};

const delExpiredLog = (app: AppJSON) => {
  const logDir: string = path.dirname(app.out_file);
  const allDir: string[] = globSync(`${logDir}/*/`);
  const loop: number = app.loop || 3;

  allDir.map((item: string) => {
    const dirname: string = path.basename(item);
    const today: string = moment().format('YYYY-MM-DD');
    const expired: boolean = (new Date(today).getTime() - new Date(dirname).getTime()) >= (loop * 24 * 60 * 60 * 1000);

    if (expired) {
      rimraf(item, (err) => {
        if (err) {
          logger.error(`Clear expired logs directory \`${item}\` failed!`);
        } else {
          logger.info(`Clear expired logs directory \`${item}\` successfully!`);
        }
      });
    }
  });
};

export default rename;
