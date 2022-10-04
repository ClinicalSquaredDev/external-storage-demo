import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import expressWinston from "express-winston";
import winston from "winston";
import constants from "./helpers/constants";
import config from "./load.config";
import routes from "./api/v1/routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthHandler from "./api/middleware/authHandler";
import { fsUtil, assert } from "blockapps-rest";
import fs from "fs";
import dotenv from "dotenv";

if (
  !process.env.EXT_STORAGE_S3_ACCESS_KEY_ID ||
  !process.env.EXT_STORAGE_S3_BUCKET ||
  !process.env.EXT_STORAGE_S3_SECRET_ACCESS_KEY
) {
  dotenv.config();
}

assert.isDefined(
  process.env.EXT_STORAGE_S3_ACCESS_KEY_ID,
  "Missing external storage params"
);
assert.isDefined(
  process.env.EXT_STORAGE_S3_BUCKET,
  "Missing external storage params"
);
assert.isDefined(
  process.env.EXT_STORAGE_S3_SECRET_ACCESS_KEY,
  "Missing external storage params"
);

const app = express();

const { baseUrl } = constants;

// create temp directory if it doesnt exist
if (!fs.existsSync(constants.tempUploadDir)) {
  fs.mkdirSync(constants.tempUploadDir);
}

// Setup app deployment
const deploy = fsUtil.getYaml(config.deployFilename);
assert.isDefined(deploy, "Deployment should be defined");
app.set(constants.deployParamName, deploy);
app.set(constants.s3ParamName, {
  bucket: {
    Bucket: process.env.EXT_STORAGE_S3_BUCKET
  },
  accessKeyId: process.env.EXT_STORAGE_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.EXT_STORAGE_S3_SECRET_ACCESS_KEY
});

// Setup middleware
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

// Setup logging
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: true,
    expressFormat: true
  })
);

// Initialize app oauth
AuthHandler.init(app);

// Setup routes
app.use(`${baseUrl}`, routes);

// TODO: Setup error handler

// Start the server
const port = process.env.PORT || 3030;
const server = app.listen(port, () => console.log(`Listening on ${port}`));

export default server;
