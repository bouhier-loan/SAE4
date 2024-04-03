const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Read all directories in the directory
fs.readdirSync('.', {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
        const serviceDir = path.join('.', dirent.name);

        // If .env-template exists, copy it to .env
        const envTemplatePath = path.join(serviceDir, '.env-template');
        if (fs.existsSync(envTemplatePath)) {
            fs.copyFileSync(envTemplatePath, path.join(serviceDir, '.env'));
        }

        // Run npm i in the service directory
        execSync('npm i', {cwd: serviceDir, stdio: 'inherit'});
    });