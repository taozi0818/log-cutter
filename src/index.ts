import { CronJob } from 'cron';
import { default as cutter} from './cutter';
import * as apps from '../app.json';
import { getLogger } from 'log4js';

const logger = getLogger();
const logCutter = new CronJob({
  cronTime: '00 00 22 * * *',
  onTick: async () => {
    logger.info('Starting clear expired logs successfully!');

    try {
      await cutter(apps);
      logger.info('Clear expired logs successfully!');
    } catch (e) {
      logger.error(e);
    }
  },
  start: false,
  timeZone: 'Asia/Shanghai'
});

logCutter.start();
logger.level = 'INFO';
