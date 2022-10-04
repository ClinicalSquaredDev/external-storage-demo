import express from "express";
import UserController from "./users.controller";
import { users } from "../endpoints";
const router = express.Router();

router.get(users.me, UserController.me);
router.get(users.getUsers, UserController.getUsers);

export default router;
