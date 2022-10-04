import express from "express";
const router = express.Router();
import AuthenticationController from "./authentication.controller";
import authHandler from "../../middleware/authHandler";
import asyncHandler from "../../middleware/asyncHandler";
import { authentication } from "../endpoints";
/**
 * route for oauth flow
 */
router.get(
  authentication.callback,
  asyncHandler(AuthenticationController.callback)
);
router.get(
  authentication.logout,
  authHandler.authorizeRequest(),
  AuthenticationController.logout
);

export default router;
