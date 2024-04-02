const fs = require('fs');
const { exec } = require('child_process');

fs.readdirSync('.').forEach(folder => {
    if (fs.existsSync(`./${folder}/package.json`)) {
        const serviceName = require(`./${folder}/package.json`).name;
        console.log(`START | ${serviceName}: Starting...`);
        exec(`cd ${folder} && node server.js`, (err, stdout, stderr) => {
            if (err) {
                console.error(`ERROR | ${serviceName}: ${err}`);
                return;
            }
            console.log(`INFO | ${serviceName}: ${stdout}`);
            console.error(`ERROR | ${serviceName}: ${stderr}`);
        });
    }
});