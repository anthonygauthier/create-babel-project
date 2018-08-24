import { exec } from 'child_process';
import logger from 'fancy-log';
import 'babel-polyfill';

module.exports.modulePromise = async (path, module) => {
  return new Promise((resolve, reject) => {
    exec(`npm install --prefix ${path} ${module}`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        logger.info(`Installed module ${module}`)
        resolve(stdout);
      }
    });
  });
};