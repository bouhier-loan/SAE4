const fs = require('fs');
const { exec } = require('child_process');

fs.readdirSync('.').forEach(folder => {
    if (fs.existsSync(`./${folder}/package.json`)) {
        const serviceName = require(`./${folder}/package.json`).name;
        console.log(`START | ${serviceName}: Starting...`);
        let child = exec(`cd ${folder} && node server.js`, (err, stdout, stderr) => {
            if (err) {
                console.error(`ERROR | ${serviceName}: ${err}`);
                return;
            }
            console.log(`INFO | ${serviceName}: ${stdout}`);
            console.error(`ERROR | ${serviceName}: ${stderr}`);
        });
        // When the child process logs something, log it to the console
        // Remove the \n at the end of the data
        child.stdout.on('data', data => console.log(`INFO | ${serviceName}: ${data.toString().replace(/\n$/, '')}`));
    }
});
console.log('INFO | All services started!\n');