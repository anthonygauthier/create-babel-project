import fs from 'fs';
import {execSync} from 'child_process';
import {modulePromise} from './lib/utils';
import 'babel-polyfill';
import logger from 'fancy-log';

let createNewProject = async path => {
  return new Promise((resolve, reject) => {
    const preset = {
      "presets": ["env"]
    };
    //remove slash if present at last character - makes it easier to read paths in code afterwards
    path = (path.charAt(path.length - 1) === '/') ? path.substr(0, path.length - 1) : path;

    logger.info(`Creating project folder in ${path}`);
    try {
      fs.mkdirSync(path);
    } catch (e) {
      logger.error(`Folder "${path}" already`)
      reject();
    }
    
    logger.info("Initiating project folder with NPM...");
    execSync(`cd ${path} && npm init -y`);

    logger.info("Asynchronously installing all required modules");
    let promises = [
      modulePromise(path, 'babel-cli'),
      modulePromise(path, 'babel-core'),
      modulePromise(path, 'babel-polyfill'),
      modulePromise(path, 'babel-preset-env'),
      modulePromise(path, 'mocha')
    ];

    Promise.all(promises)
      .then(() => {
        logger.info("Adding '.babelrc' file");
        fs.writeFileSync(`${path}/.babelrc`, JSON.stringify(preset, undefined, 2));

        logger.info("Modifying package.json to add the following scripts: test, compile, postinstall");
        const packageJSON = JSON.parse(fs.readFileSync(`${path}/package.json`));
        packageJSON.scripts.test = "./node_modules/.bin/babel  ./src --experimental --source-maps-inline -d ./dist && export NODE_ENV=test || SET \"NODE_ENV=test\" && mocha --exit dist/test/*.test.js";
        packageJSON.scripts.compile = "./node_modules/.bin/babel  ./src --experimental --source-maps-inline -d ./dist";
        packageJSON.scripts.postinstall = "./node_modules/.bin/babel  ./src --experimental --source-maps-inline -d ./dist";
        fs.writeFileSync(`${path}/package.json`, JSON.stringify(packageJSON, undefined, 2));

        logger.info("Creating project structure");
        fs.mkdirSync(`${path}/src`);
        fs.mkdirSync(`${path}/src/test`);

        resolve();
      })
      .catch((err) => {
        reject(err);
      });    
  });
}

module.exports = {
  createNewProject
}