import express from "express";
import { files } from "../endpoints";
import multer from "multer";
import FilesController from "./files.controller";
import constants from "../../../helpers/constants";

const router = express.Router();
const fileUploader = multer({ storage: multer.memoryStorage() });

router.post(
  files.uploadFile,
  fileUploader.single(constants.fileUploadFieldName),
  FilesController.uploadFile
);

router.post(
  files.uploadVersion,
  fileUploader.single(constants.fileUploadFieldName),
  FilesController.uploadVersion
);

router.post(
  files.attestFile,
  fileUploader.single(constants.fileUploadFieldName),
  FilesController.attestFile
);

router.post(files.members, FilesController.share);
router.delete(files.members, FilesController.remove);

router.post(files.transfer, FilesController.transfer);

router.get(files.downloadFile, FilesController.downloadFile);
router.get(files.getFiles, FilesController.getFiles);
router.get(files.getFile, FilesController.getFile);

export default router;
