# Projen with package.json as source of truth for dependencies

Initial stab at letting package.json be source of truth for dependenciesin a Projen project.

Why? To enable the usage of third-party tools that do not yet understand projenrc.ts, and thus cannot automatically create PR's with upgrades.

Assume the NodeProject's [Dependency Upgrades](https://projen.io/docs/project-types/node/#dependency-upgrades) GitHub Action is not an option. 

The config here will read package.json before synthesis, and populate the Project with the dependencies that already exist. This will mean a PR which updates package.json with a version upgrade will be retained by projen.

It also has the downside than an upgrade of Projen may not automatically update it's own devDependencies.

## How it works

During Projen run, the following happens:

1. read existing dependencies from package.json before synthesis
    1.1 call `captureDependencies` in `.projenrc.ts`
2. populate the Project with the dependencies that already exist
    2.1 call `applyCapturedDependencies` in `.projenrc.ts`
3. projen will then write package.json with merged dependencies, favouring what exists in package.json

This lets third-party tools which do not understand projenrc.ts (or the package manager's lockfile) to suggest edits to package.json which will be retained by projen.

## Caveats

1. An upgrade of Projen may not automatically update it's own devDependencies.
2. dependencies are only read from package.json, not from the lockfile.


# Alternatives
 - NodeProject's [Dependency Upgrades](https://projen.io/docs/project-types/node/#dependency-upgrades) 
 - Dependabots [lockfile-only](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference) option 