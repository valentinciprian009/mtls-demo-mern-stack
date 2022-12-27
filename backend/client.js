const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    key: fs.readFileSync('../frontend/keys/extern.key'),
    cert: fs.readFileSync('../frontend/certs/extern.crt'),
    ca: [
        fs.readFileSync('./certs/ca.crt'),
    ],
    passphrase: 'externmagic',
    rejectUnauthorized: true
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log('headers: ', res.headers);

    res.on('data', d => {
        process.stdout.write(d);
    });
} );