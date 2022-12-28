const app = require('./app');
const https = require('https');
const fs = require('fs');
const config = require('./config/config');
const logger = require('./utils/logger');

const options = {
    port: config.PORT,
    key: fs.readFileSync(config.KEY_PATH),
    cert: fs.readFileSync(config.CERT_PATH),
    ca: [
        fs.readFileSync(config.CA_CERT_PATH),
    ],
    crl: [
        fs.readFileSync(config.CRL_CERT_PATH),
    ],
    passphrase: config.CERT_PASSPHRASE,
    port: config.PORT,
    requestCert: true,
    rejectUnauthorized: true
};

const server = https.createServer(options, app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});