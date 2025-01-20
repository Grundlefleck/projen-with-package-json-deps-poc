import * as fs from 'fs';
import { NodeProject } from 'projen/lib/javascript';

type Dependencies = {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
};


/*
 * Read package.json file and return the dependencies and devDependencies.
 */
export function captureDependencies(input: { packageJsonPath: string }): Dependencies {
    const { packageJsonPath } = input;
    if (!fs.existsSync(packageJsonPath)) {
        console.error('package.json not found.');
        return { dependencies: {}, devDependencies: {} };
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    return {
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
    };
}

/*
 * Set dependencies, and devDependencies apply them to the given NodeProject.
 */
export function applyCapturedDependencies(
    project: NodeProject,
    originalDeps: Dependencies
): void {
    Object.entries(originalDeps.dependencies).forEach(([pkg, version]) => {
        project.addDeps(`${pkg}@${version}`);
    });

    Object.entries(originalDeps.devDependencies).forEach(([pkg, version]) => {
        project.addDevDeps(`${pkg}@${version}`);
    });
}