import { typescript } from 'projen';
import { applyCapturedDependencies, captureDependencies } from './.projen/merge-dependencies';
import path from 'path';

const packageJsonPath = path.resolve(__dirname, 'package.json');
/*
 Before creating the project, captures the dependencies from package.json.

 Runs prior to the project being created so that projen cleanup has not run, and we're taking the file verbatim.
*/
const originalDeps = captureDependencies({ packageJsonPath });

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'projen-with-package-json-deps-poc',
  projenrcTs: true,

  deps: ['left-pad@1.3.0'], // Optionally specify dependencies here if you want.
  devDeps: [], // This will inherit a bunch of projen defaults from the Project type, but they will only be used for bootstrapping.
});

/*
 After the project is created, apply the dependencies from the original package.json.

 This is done after the project is created, but prior to synth. This lets us manipulate the project's dependencies
 prior to writing any files. If projen writes package.json file before add existing deps, we're too late to use it as a source of truth.
*/
applyCapturedDependencies(project, originalDeps);

project.synth();
