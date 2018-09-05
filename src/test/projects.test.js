import fs from 'fs-extra';
import expect from 'expect';
import projects from '../projects';

describe('Testing the project creation', function() {
  this.timeout(40000);
  const path = './myTestProject';
  let packageJSON = '';

  before((done) => {  
    projects.createNewProject(path).then(() => {
      packageJSON = JSON.parse(fs.readFileSync(`${path}/package.json`));
      done();
    });
  });

  it('should verify that the project folder was created properly', (done) => {
    expect(fs.pathExistsSync(path)).toBe(true);
    done();
  });

  it('should verify that all packages are present in package.json file', (done) => {
    expect(Object.keys(packageJSON.dependencies).length).toBe(5);
    expect(packageJSON.dependencies["babel-cli"]).toBeDefined();
    expect(packageJSON.dependencies["babel-core"]).toBeDefined();
    expect(packageJSON.dependencies["babel-polyfill"]).toBeDefined();
    expect(packageJSON.dependencies["babel-preset-latest"]).toBeDefined();
    expect(packageJSON.dependencies["mocha"]).toBeDefined();
    done();
  });

  it('should verify that all scripts are present in package.json file', (done) => {
    expect(Object.keys(packageJSON.scripts).length).toBe(3);
    expect(packageJSON.scripts.test).toBeDefined();
    expect(packageJSON.scripts.compile).toBeDefined();
    expect(packageJSON.scripts.postinstall).toBeDefined();
    done();
  });

  it('should verify that the .babelrc file exists', (done) => {
    expect(fs.pathExistsSync(`${path}/.babelrc`)).toBe(true);
    done();
  });

  it('should verify that the .babelrc preset is "latest"', (done) => {
    expect(JSON.parse(fs.readFileSync(`${path}/.babelrc`))["presets"][0]).toBe("latest");
    done();
  });

  after((done) => {
    fs.remove(path, () => {
      console.log('Cleaned up test folders');
      done();
    });
  });
})