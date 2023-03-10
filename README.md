# mTLS demo web application using MERN stack

This is a demo web application that uses mTLS to authenticate users and the server. The application is built using the MERN stack (MongoDB, Express, React, Node.js).

In this demo the server uses a certificate signed by a CA to authenticate itself to the client. For each node in the server the client needs to have a certificate signed by the same CA to authenticate itself to the server, but also it is required that said certificate has the O, OU and CN fields set to the same values as the server's node logic. I`ve used this aproach because I wanted to exemplify how to use mTLS in a microservices architecture. 

![mTLS demo web application using MERN stack](./screenshots/home.png)

Disclaimer: This is a demo application and is not intended for production use.

## Project structure

The project is structured as follows:

| Directory | Description |
| --- | --- |
| [`frontend`](./frontend/)| The React client application |
| [`backend`](./backend/)| The Node.js server application |
| [`certs`](./certs/)| The CA and server certificates |
| [`keys`](./keys/)| The server keys |
| [`client_certs`](./client_certs/)| The client certificates used by user on the client application |
| [`client_keys`](./client_keys/)| The client keys stored by the user |
| [`example-keys-certs`](./example-keys-certs/)| Example keys and certificates |

## Prerequisites

- Windows 10/11 with WSL2
- Node.js
- npm
- openssl
- easy-rsa

## Installation

1. Clone the repository
2. Install the dependencies, set up the CA and export the certificate
3. Generate the keys and certificates
4. Add the certificates to the Windows certificate store
5. Configure the application
6. Add the common name of the server certificate to the hosts file
7. Run the application
8. Access the application

### 1. Clone the repository

```bash
cd ~
git clone git@github.com:valentinciprian009/mtls-demo-mern-stack.git
```

### 2. Install the dependencies

For this step I recommend using wsl2 on Windows with Ubuntu 20.04 because openssl is already installed.

For the CA, I used easy-rsa. You can install it by following the instructions on the [easy-rsa DigitalOcean page](https://www.digitalocean.com/community/tutorials/how-to-set-up-and-configure-a-certificate-authority-ca-on-ubuntu-20-04) or by running the following commands:

```bash
sudo apt update
sudo apt install easy-rsa
```

Then, run the following commands to set up the CA:

```bash
mkdir ~/easy-rsa
ln -s /usr/share/easy-rsa/* ~/easy-rsa/
chmod 700 ~/easy-rsa
cd ~/easy-rsa
./easyrsa init-pki
```

You should get the following output:

```bash
init-pki complete; you may now create a CA or requests.
Your newly created PKI dir is: ~/easy-rsa/pki
```

Now you can prepare the CA:

```bash
cd ~/easy-rsa
nano vars
```

Add the following lines to the file:

```bash
set_var EASYRSA_REQ_COUNTRY    "RO"
set_var EASYRSA_REQ_PROVINCE   "Bucharest"
set_var EASYRSA_REQ_CITY       "Bucharest"
set_var EASYRSA_REQ_ORG        "MTA"
set_var EASYRSA_REQ_EMAIL      "ca@mta.ro"
set_var EASYRSA_REQ_OU         "Master"
set_var EASYRSA_ALGO           "rsa"
set_var EASYRSA_DIGEST         "sha512"
```

You can chante the first 7 lines to your own values. The last 2 lines should be changed only after reading the easy-rsa documentation.

After that, you can build the CA:

```bash
./easyrsa build-ca
```

You should get the following output:

```bash
. . .
Enter New CA Key Passphrase:
Re-Enter New CA Key Passphrase:
. . .
Common Name (eg: your user, host, or server name) [Easy-RSA CA]:

CA creation complete and you may now import and sign cert requests.
Your new CA certificate file for publishing is at:
~/easy-rsa/pki/ca.crt
```

Export the CA certificate (copy the output of the following command and save it to a file named [`ca.crt`](./certs/ca.crt) in the [`certs`](./certs/) folder):

```bash
cat ~/easy-rsa/pki/ca.crt
```

### 3. Generate the keys and certificates

You can skip this step if you want to use the keys and certificates that are already in the repository. If you want to generate your own keys and certificates, follow the steps below, else copy the `keys`, `certs`, `client_keys` and `client_certs` folders from the [`example-keys-certs`](./example-keys-certs/) to the [root](.) of the project and skip to step 4.

For this step I recommend using wsl2 on Windows with Ubuntu 20.04 because openssl is already installed. Let's asume you cloned the repository in the `~/mtls-demo-mern-stack` folder.

Run the following commands to generate the server key and certificate request:

```bash
cd ~/mtls-demo-mern-stack
mkdir keys
mkdir certs

openssl genpkey -out ./keys/server.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -aes-128-cbc -pass pass:servermagic

openssl req -new -key ./keys/server.key -out ./certs/server.csr -passin pass:servermagic -subj "/C=RO/ST=Bucharest/L=Bucharest/O=MTA/OU=Master-Server/CN=mtls-demo.ro/emailAddress=server@mta.ro"
```

Using the CA, sign the certificate request:

```bash
cd ~/easy-rsa
./easyrsa import-req ~/mtls-demo-mern-stack/certs/server.csr server
./easyrsa sign-req server server
```

Copy the signed certificate to the `certs` folder:

```bash
cp ~/easy-rsa/pki/issued/server.crt ~/mtls-demo-mern-stack/certs/
```

Make a passwordless copy of the server key (it will be used by the react client application):

```bash
cd ~/mtls-demo-mern-stack
openssl rsa -in ./keys/server.key -out ./keys/server-no-pass.key -passin pass:servermagic
```

Generate the client key and certificate request:

For this example I will generate 4 client keys.

| Client certificate | Usage |
| --- | --- |
| [`client.crt`](./client_certs/client.crt) | Used for the public news endpoint |
| [`private_client.crt`](./client_certs/private_client.crt) | Used for the private and public news endpoints |
| [`admin_client.crt`](./client_certs/admin_client.crt) | Used for the admin, private and public news endpoints |
| [`invalid_client.crt`](./client_certs/invalid_client.crt) | Can't be used for any endpoint because it's not signed by the CA |
| [`revoked_client.crt`](./client_certs/revoked_client.crt) | Can't be used for any endpoint because it's revoked |

```bash
cd ~/mtls-demo-mern-stack
mkdir client_keys
mkdir client_certs

openssl genpkey -out ./client_keys/client.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -aes-128-cbc -pass pass:clientmagic

openssl req -new -key ./client_keys/client.key -out ./client_certs/client.csr -passin pass:clientmagic -subj "/C=RO/ST=Bucharest/L=Bucharest/O=MTA/OU=Master-Client/CN=mtls-pub-client/emailAddress=client@mta.ro"

openssl genpkey -out ./client_keys/private_client.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -aes-128-cbc -pass pass:privatemagic

openssl req -new -key ./client_keys/private_client.key -out ./client_certs/private_client.csr -passin pass:privatemagic -subj "/C=RO/ST=Bucharest/L=Bucharest/O=MTA/OU=Master-Private/CN=mtls-private-client/emailAddress=private@mta.ro"

openssl genpkey -out ./client_keys/admin_client.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -aes-128-cbc -pass pass:adminmagic

openssl req -new -key ./client_keys/admin_client.key -out ./client_certs/admin_client.csr -passin pass:adminmagic -subj "/C=RO/ST=Bucharest/L=Bucharest/O=MTA/OU=Master-Admin/CN=mtls-admin-client/emailAddress=admin@mta.ro"

openssl genpkey -out ./client_keys/invalid_client.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -aes-128-cbc -pass pass:invalidmagic

openssl req -new -key ./client_keys/invalid_client.key -out ./client_certs/invalid_client.csr -passin pass:invalidmagic -subj "/C=RO/ST=Bucharest/L=Bucharest/O=MTA/OU=Master-Other/CN=mtls-other-client/emailAddress=other@mta.ro"

openssl genpkey -out ./client_keys/revoked_client.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -aes-128-cbc -pass pass:revokedmagic

openssl req -new -key ./client_keys/revoked_client.key -out ./client_certs/revoked_client.csr -passin pass:revokedmagic -subj "/C=RO/ST=Bucharest/L=Bucharest/O=MTA/OU=Master-Other/CN=mtls-revoked-client/emailAddress=revoked@mta.ro"
```

Using the CA, sign the certificate requests:

```bash
cd ~/easy-rsa
./easyrsa import-req ~/mtls-demo-mern-stack/client_certs/client.csr client
./easyrsa sign-req client client

./easyrsa import-req ~/mtls-demo-mern-stack/client_certs/private_client.csr private_client
./easyrsa sign-req client private_client

./easyrsa import-req ~/mtls-demo-mern-stack/client_certs/admin_client.csr admin_client
./easyrsa sign-req client admin_client

./easyrsa import-req ~/mtls-demo-mern-stack/client_certs/revoked_client.csr revoked_client
./easyrsa sign-req client revoked_client
```

Copy the signed certificates to the `client_certs` folder:

```bash
cd ~/easy-rsa
cp ./pki/issued/client.crt ~/mtls-demo-mern-stack/client_certs/

cp ./pki/issued/private_client.crt ~/mtls-demo-mern-stack/client_certs/

cp ./pki/issued/admin_client.crt ~/mtls-demo-mern-stack/client_certs/

cp ./pki/issued/invalid_client.crt ~/mtls-demo-mern-stack/client_certs/
```

Self sign the `invalid_client` certificate:

```bash
cd ~/mtls-demo-mern-stack/
openssl x509 -req -in ./client_certs/invalid_client.csr -signkey ./client_keys/invalid_client.key -out ./client_certs/invalid_client.crt -passin pass:invalidmagic
```

Revoke the `revoked_client` certificate:

```bash
cd ~/easy-rsa
./easyrsa revoke revoked_client
```

Export the CRL to the `certs` folder:

```bash
cd ~/easy-rsa
./easyrsa gen-crl
cp ./pki/crl.pem ~/mtls-demo-mern-stack/certs/
```

4. Import the certificates in the Windows Certificate Manager

First, import the server CA certificate in the Windows Certificate Manager. To do this, open the `certmgr.msc` application and follow the steps below:

Step 1: 

![Step 1](./screenshots/windows-cert-manager/1.png)

Step 2:

![Step 2](./screenshots/windows-cert-manager/2.png)

Then follow the steps and upload the [`ca.crt`](./certs/ca.crt) file from the [`certs`](./certs/) folder.

Before importing the client certificates, you need to export the client keys to a `.pfx` file (pkcs12 format). To do this, run the following commands:

```bash
cd ~/mtls-demo-mern-stack/

openssl pkcs12 -inkey ./client_keys/client.key -in ./client_certs/client.crt -export -out ./client_certs/client.pfx -passin pass:clientmagic

openssl pkcs12 -inkey ./client_keys/private_client.key -in ./client_certs/private_client.crt -export -out ./client_certs/private_client.pfx -passin pass:privatemagic

openssl pkcs12 -inkey ./client_keys/admin_client.key -in ./client_certs/admin_client.crt -export -out ./client_certs/admin_client.pfx -passin pass:adminmagic

openssl pkcs12 -inkey ./client_keys/invalid_client.key -in ./client_certs/invalid_client.crt -export -out ./client_certs/invalid_client.pfx -passin pass:invalidmagic

openssl pkcs12 -inkey ./client_keys/revoked_client.key -in ./client_certs/revoked_client.crt -export -out ./client_certs/revoked_client.pfx -passin pass:revokedmagic
```

Now you can import the client certificates in the windows trusted root certificates:

Make sure you use the same password as the one you used when exporting the `.pfx` file. Also if you import the `.crt` file instead of the `.pfx` file you will not be able to use the certificate in the browser.

![Step 3](./screenshots/windows-cert-manager/3.png)

5. Configure the application

Make sure the paths you have and the passwords you chose are the same as the ones in the [`config.js`](./backend/config/config.js), [`.env`](./backend/.env) and [`package.json`](./frontend/package.json) files.

Also feel free to change the access conditions in the [`newsRoutes.js`](./backend/routes/newsRoutes.js) file.

6. Add the common name of the server to the hosts file

To be able to access the application from the browser, you need to add the common name of the server to the hosts file. To do this, open the `C:\Windows\System32\drivers\etc\hosts` file and add the following line:

```bash
127.0.0.1 mtls-demo.ro
```

Feel free to change the common name of the server to whatever you want, but make sure you`re using the same name for the common name of the certificates.

7. Run the application

To run the application, you need to start the backend and the frontend. To do this, run the following commands:

```bash
cd ~/mtls-demo-mern-stack/backend
npm install
npm start
```

```bash
cd ~/mtls-demo-mern-stack/frontend
npm install
npm start
```

8. Access the application

To access the application, open the browser and go to the following address:

```bash
https://mtls-demo.ro:3000
```

After you clicked on one of the 3 news pages, you will be redirected and asked to choose a certificate. Choose the certificate you want to use. 

- If you choose the `client` certificate, you will be able to public news.
- If you choose the `private_client` certificate, you will be able to private news and public news.
- If you choose the `admin_client` certificate, you will be able to private news, public news and admin news.
- If you choose the `revoked_client` certificate, you will not be able to access any news because the certificate was revoked.
- Any other certificate should not appear in the list because it was not signed by the server CA (including the `invalid_client` certificate).