import { CronJob } from 'cron';
import rename from '../src/cutter';
import * as apps from './app.json';
const path = require('path');

const logCutter = new CronJob({
  cronTime: '00 00 22 * * *',
  onTick: () => {
    // TODO Func for cutting log
  },
  start: false,
  timeZone: 'Asia/Shanghai'
});

logCutter.start();
rename(apps);

