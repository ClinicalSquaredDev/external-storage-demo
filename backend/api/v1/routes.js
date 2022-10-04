import express from "express";
const router = express.Router();
import moment from "moment";
import * as packageJson from "../../package.json";
import { deployParamName } from "../../helpers/constants";
import authenticationController from "./authentication";
import authHandler from "../middleware/authHandler";
import usersController from "./users";
import filesController from "./files";
import { files, users, authentication } from "./endpoints";

router.use(authentication.prefix, authenticationController);

router.use(users.prefix, authHandler.authorizeRequest(), usersController);

router.use(files.prefix, authHandler.authorizeRequest(), filesController);

router.get(`/health`, (req, res) => {
  const deployment = req.app.get(deployParamName);
  res.json({
    name: packageJson.name,
    name: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
    timestamp: moment().unix(),
    deployment
  });
});

export default router;
