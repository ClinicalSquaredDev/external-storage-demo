# BA Strato Demo App

## Requirements

- Docker (+ Docker Compose)
- Node (NPM & YARN)

<!-- ### Pre-requisites

Start STRATO with below command:

```
  HTTP_PORT=8080 \
  NODE_HOST=localhost:8080 \
  OAUTH_ENABLED=true \
  OAUTH_DISCOVERY_URL=https://keycloak.blockapps.net/auth/realms/strato-devel/.well-known/openid-configuration \
  OAUTH_CLIENT_ID=localhost-80-infinite \
  OAUTH_CLIENT_SECRET=adac9a89-ee8b-4683-b043-084ae14ef776 \
  OAUTH_JWT_USERNAME_PROPERTY=email \
  PASSWORD=1234 \
  ./strato --single
```

### Run external-storage-demo application locally (for development) -->
\
<br/>


## Setup

<br/>

### Start nginx

\
Nginx acts as a proxy for the frontend and the backend. It is required so that both the frontend and the backend have the same root URL (required for authentication).

```
cd nginx-docker
```

LINUX:

```
HOST_IP=172.17.0.1 docker-compose up -d
```

MAC:

```
export HOST_IP=docker.for.mac.localhost && docker-compose up -d
```
\
<br/>

### Deploy the Dapp and Start The Backend

<br/>
<!-- ```
cd external-storage-demo/backend
yarn install
``` -->

```
cd ../backend
yarn install
```
\
<br/>

#### Deploy contracts:

```
export SERVER=csquared && yarn deploy
```
\
Set environment variables for S3 and start the backend server (paste in credentials):

```
export EXT_STORAGE_S3_ACCESS_KEY_ID= && \
export EXT_STORAGE_S3_BUCKET= && \
export EXT_STORAGE_S3_SECRET_ACCESS_KEY= && \
yarn start
```

_NOTE: `yarn start` will start the server and use the terminal window to dump log information. To stop the server, hit `CTRL+C`_.

\
<br/>

#### Launch UI

In a new terminal window, run the following commands:

```
cd ui
yarn install
yarn develop
```

This should open a browser window and display a basic React webpage.

_NOTE: Please make sure that `nginx` is up WITH CORRECT HOST_IP (see above)._

_NOTE: Your IP address may change if you change the WIFI or in other reasons. In that case restart nginx container with actual HOST_IP._

_NOTE: `yarn develop` will start the UI and use the terminal window to dump log information. To stop the UI, hit `CTRL+C`_.

<br/>
<br/>

### Stopping the App

To stop the app, hit `CTRL+C` on the server and UI windows.

To stop the nginx server run:

```
docker stop nginx-docker_nginx_1
```
\
<br/>

## Run the app in Docker (the production way)
<br/>

#### 1. Build docker images

```
sudo docker-compose build
```

<br/>

#### 2a. Run as external-storage-demo bootnode (main node in multi-node environment)

1. Example command to run locally in docker:

   ```
   #!/bin/bash
   set -e

   export IS_BOOTNODE=true
   export API_DEBUG=true
   export SERVER_HOST=http://<your external IP address> # can't use 127.0.0.1
   export SERVER_IP=<your external IP address> # can't use 127.0.0.1
   export OAUTH_OPENID_DISCOVERY_URL=https://<oauth provider url>/.well-known/openid-configuration
   export OAUTH_CLIENT_ID=<oauth provider client id>
   export OAUTH_CLIENT_SECRET=<oauth provider client secret>
   export NODE_LABEL='My boot node'
   export SSL=true

   docker-compose up -d
   ```

   (For additional parameters, see "docker-compose.yml env vars reference" below)

2. Wait for all docker containers to become healthy (`sudo docker ps`)

<br/>

#### 2b. Run as app secondary node (in multi-node environment)

Secondary node is the one that connects to the existing Dapp contract on the blockchain (which is initially deployed on app bootnode)

1. On bootnode - Get deploy file content:
   ```
   sudo docker exec external-storage-demo_backend_1 cat /config/external-storage-demo.deploy.yaml
   ```
2. On secondary node - create docker volume and add the same external-storage-demo.deploy.yaml file using commands:
   ```
   sudo su
   docker volume create external-storage-demo_config
   APP_CONFIG_VOLUME_DIR=$(docker volume inspect --format '{{ .Mountpoint }}' external-storage-demo_config)
   nano ${APP_CONFIG_VOLUME_DIR}/external-storage-demo.deploy.yaml
   # paste content and save
   exit
   ```
3. Run application:

   ```
   #!/bin/bash
   set -e

   export API_DEBUG=true
   export SERVER_HOST=http://<your external IP address> # can't use 127.0.0.1
   export SERVER_IP=<your external IP address> # can't use 127.0.0.1
   export OAUTH_OPENID_DISCOVERY_URL=https://<oauth provider url>/.well-known/openid-configuration
   export OAUTH_CLIENT_ID=<oauth provider client id>
   export OAUTH_CLIENT_SECRET=<oauth provider client secret>
   export NODE_LABEL='My secondary node'
   export SSL=true

   docker-compose up -d
   ```

   (notice the IS_BOOTNODE and NODE_LABEL changes compared to bootnode's script from (2a))

#### docker-compose.yml env vars reference

Some docker-compose vars are optional with default values and some are required for prod or specific OAuth provider setup.

```
IS_BOOTNODE                 - (default: 'false') if false - .deploy.yaml is expected in docker volume
API_DEBUG                   - (default: 'false') show additional logs of STRATO API calls in backend container log
CONFIG_DIR_PATH             - (default: '/config') directory inside of container to keep the config file. Not recommended to change unless you know what you are doing.
DEPLOY_FILE_NAME            - (default: 'external-storage-demo.deploy.yaml') filename of the targeted deploy file. Not recommended to change unless you know what you are doing.
APPLICATION_USER_NAME       - (default: 'APP_USER') the username of service user
SERVER_HOST                 - (required) protocol and host (protocol://hostname:port, e.g. https://example.com) of the application server
SERVER_IP                   - (required) IP address of the machine (preferably public one or the private that is accessible from other nodes in network)
NODE_LABEL                  - (required) String representing the node identificator (e.g. external-storage-demo-node1)
STRATO_NODE_PROTOCOL        - (default: 'http') Protocol of the STRATO node (http|https)
STRATO_NODE_HOST            - (default: 'strato_nginx_1:80') host (hostname:port) of the STRATO node. By default - call STRATO node in the linked docker network (see bottom of docker-compose.yml)
STRATO_LOCAL_IP             - (default: empty string, optional) Useful for Prod when STRATO is running on https and we have to call it by real DNS name (SSL requirement) but need to resolve it through the local network (e.g. STRATO port is closed to the world). Non-empty value will create /etc/hosts record in container to resolve hostname provided in STRATO_HOST to STRATO_LOCAL_IP. Example: `172.17.0.1` (docker0 IP of machine - see `ifconfig`). Otherwise - will resolve hostname with public DNS.
NODE_PUBLIC_KEY             - (default: dummy hex public key) STRATO node's blockstanbul public key
OAUTH_APP_TOKEN_COOKIE_NAME - (default: 'external-storage-demo_session') Browser session cookie name for the node, e.g. external-storage-demo-node1-session'
OAUTH_OPENID_DISCOVERY_URL  - (required) OpenID discovery .well-known link
OAUTH_CLIENT_ID             - (required) OAuth client id (Client should have the redirect uri `/api/v1/authentication/callback` set up on OAuth provider)
OAUTH_CLIENT_SECRET         - (required) OAuth client secret
OAUTH_SCOPE                 - (default: 'openid email') - custom OAuth scope (e.g. for Azure AD v2.0 authentication: 'openid offline_access <client_secret>/.default')
OAUTH_SERVICE_OAUTH_FLOW    - (default: 'client-credential') - OAuth flow to use for programmatic token fetch (refer to blockapps-rest options)
OAUTH_TOKEN_FIELD           - (default: 'access_token') - value of the service flow response to use as access token (e.g. 'access_token'|'id_token')
OAUTH_TOKEN_USERNAME_PROPERTY               - (default: 'email') - OAuth access token's property to use as user identifier in authorization code grant flow (e.g. 'email' for Keycloak, 'upn' for Azure AD)
OAUTH_TOKEN_USERNAME_PROPERTY_SERVICE_FLOW  - (default: 'email') - OAuth access token's property to use as user identifier in oauth service (e.g. client-credential) flow (e.g. 'email for Keycloak, 'oid' for Azure AD)
SSL                         - (default: 'true')    - rather to run on http or https ('false'|'true') (see SSL cert letsencrypt tool section for fetching the cert)
SSL_CERT_TYPE               - (default: 'crt') SSL cert file type ('crt'|'pem') - see "SSL cert letsencrypt tool" for steps to get/provide cert
```

#### SSL cert letsencrypt tool

The tool automates the process of obtaining the real SSL certificate using certbot and letsencrypt to use for running application on https:// for production.
Certs are valid for 3 months and should be auto-updated.
To run the Application we need the first (initial) certificate to provide it to the container.
After that, when the Application is already running, the certificate will be automatically renewed (see "Setup auto-renewal")

For steps to use letsencrypt tool please refer to external-storage-demo/nginx-docker/letsencrypt/README.md

#### Obtaining OAuth access token

Each call made to STRATO API requires the valid access token obtained from OAuth provider (the App and the STRATO node should use same OpenID Discovery URL)
In the `yarn deploy` step the application is programmatically fetching the access token of the service user (with Client Credentials Grand flow of OAuth2) in order to make the API calls with it.

During development you may also want to obtain the token of the specific user using some of the standard OAuth2 flows.

The token can be obtained by using the `token-getter` utility packaged in `blockapps-rest`.
To use this utility, run `sudo yarn token-getter` from the `backend` directory:

```
cd external-storage-demo/backend
sudo yarn token-getter
```

_NOTE: You may need to stop your nginx container to release the port for token-getter_

This command launches a small web server on the same host (hostname and port) specified in the `redirectUri` field of `config/localhost.config.yaml`. This field was filled in by the app-framework utility from the configuration parameters it collected from the user.

- Copy the URL shown by the `token-getter` utility and enter it into your browser.
- Log in with your OAuth provider credentials.
- Once logged in, the web server will display the token on a web page.
- Copy the "Access Token".
- Hit `CTRL+C` to quit the `token-getter`.

For additional help on token-getter:

```
sudo yarn token-getter -- --help
```

#### Selenium tests

Install chrome webdriver on your machine (https://chromedriver.chromium.org/downloads) then follow these steps:

```
cd external-storage-demo/external-storage-demo-selenium
yarn test:selenium
```

Refer the inital testcases.
