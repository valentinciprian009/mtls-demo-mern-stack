require('dotenv').config();

const PORT = process.env.PORT || 3001;
const CERT_PASSPHRASE = process.env.CERT_PASSPHRASE || 'servermagic';
const CERT_PATH = process.env.CERT_PATH || '../certs/server.crt';
const KEY_PATH = process.env.KEY_PATH || '../keys/server.key';
const CA_CERT_PATH = process.env.CA_CERT_PATH || '../certs/ca.crt';

module.exports = {
    PORT,
    CERT_PASSPHRASE,
    CERT_PATH,
    KEY_PATH,
    CA_CERT_PATH
};