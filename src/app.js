import {performance} from 'perf_hooks';
import _ from 'lodash';
import yargs from 'yargs';
import logger from 'fancy-log';
import projects from './projects';

const pathOptions = {
  describe: 'The project\'s path',
  demand: true,
  alias: 'p'
};

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command('new', 'Create a new project', {
      path: pathOptions
  })
  .example('$0 new -p ~/myApp', 'creates a new project folder named \'myApp\'')
  .help()
  .epilog(`Copyright https://www.github.com/delirius325 ${new Date().getFullYear()}`)
  .argv;
const command = argv._[0];

switch(command) {
  case 'new':
    const start = performance.now();
    projects.createNewProject(argv.path)
      .then(() => {
        const end = performance.now();
        const execTime = (Math.round(end - start)/1000);
        logger.info(`Operation completed successfully! The creation of the project took ${execTime}s`);
      })
      .catch((err) => {
        logger.error("Something went wrong...");
      });
    break;
  default: 
    logger.error(`Command "${command}" is unknown.`);
    break;
}

