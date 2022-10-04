import fileJs from "../../../dapp/files/files";
import { rest, util } from "blockapps-rest";
import constants from "../../../helpers/constants";
import config from "../../../load.config";
import crypto from "crypto";
import { uploadFileToS3, getFileStreamFromS3 } from "../../../helpers/s3";
import moment from "moment";
import { isNumber } from "util";
import {basename, extname} from "path";

class FilesController {
  static async uploadFile(req, res, next) {
    const { fileDescription, comments } = req.body;

    if (!req.file) {
      rest.response.status400(res, "Missing file");
    }
    try {
      const fileKey = `${moment()
        .utc()
        .valueOf()}_${req.file.originalname}`;

      const fileHash = crypto
        .createHmac("sha256", req.file.buffer)
        .digest("hex");

      const uploadResult = await uploadFileToS3(
        `${fileKey}_${fileHash}`,
        req.file.buffer,
        req.app.get(constants.s3ParamName)
      );

      const fileInterface = await fileJs.uploadFile(
        req.user,
        {
          fileKey,
          fileName: req.file.originalname,
          fileHash,
          uri: uploadResult.Location,
          fileDescription,
          comments
        },
        { config }
      );
      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }

  static async uploadVersion(req, res, next) {
    if (!req.file) {
      rest.response.status400(res, "Missing file");
    }
    try {
      const fileKey = req.params.fileKey;

      const fileInterface = await fileJs.bind(req.user, fileKey);

      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${fileKey}`
        });
        return;
      }

      const fileHash = crypto
        .createHmac("sha256", req.file.buffer)
        .digest("hex");

      const uploadResult = await uploadFileToS3(
        `${fileKey}_${fileHash}`,
        req.file.buffer,
        req.app.get(constants.s3ParamName)
      );

      const { comments } = req.body;


      await fileInterface.addFileVersion({
        uri: uploadResult.Location,
        fileHash,
        comments
      });
      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }

  static async attestFile(req, res, next) {
    if (!req.file) {
      rest.response.status400(res, "Missing file");
    }
    try {
      const fileKey = req.params.fileKey;

      const fileInterface = await fileJs.bind(req.user, fileKey);

      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${fileKey}`
        });
        return;
      }

      const version = parseInt(req.params.version);

      if (!isNumber(version)) {
        res.status(400).json({
          success: false,
          data: `Invalid version "${req.params.version}". Should be a number`
        });
      }

      const fileHash = crypto
        .createHmac("sha256", req.file.buffer)
        .digest("hex");

      const fileVersion = fileInterface.file.versions.find(
        v => v.version == version
      );

      if (!fileVersion) {
        res.status(404).json({
          success: false,
          data: `Could not locate file version "${req.params.version}"`
        });
      }

      if (fileVersion.fileHash != fileHash) {
        rest.response.status400(
          res,
          "File hashes do not match. Attestation failed."
        );
        return;
      }

      const result = await fileInterface.attest(version);

      if (result == "0") {
        rest.response.status500(res, "Unknown issue while attesting file");
      }

      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }

  static async getFiles(req, res, next) {
    try {
      const files = await fileJs.getFiles(
        req.user,
        req.query["limit"] || constants.defaultLimit,
        req.query["offset"] || constants.defaultOffset
      );
      rest.response.status200(res, files);
    } catch (e) {
      next(e);
    }
  }

  static async getFile(req, res, next) {
    try {
      const fileInterface = await fileJs.bind(req.user, req.params.fileKey);
      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${req.params.fileKey}`
        });
        return next();
      }
      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }

  static async downloadFile(req, res, next) {
    try {
      const fileInterface = await fileJs.bind(req.user, req.params.fileKey);
      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${req.params.fileKey}`
        });
        return;
      }

      const version = parseInt(req.params.version);

      if (!isNumber(version)) {
        res.status(400).json({
          success: false,
          data: `Invalid version "${req.params.version}". Should be a number`
        });
      }

      const fileVersion = fileInterface.file.versions.find(
        v => v.version == version
      );

      if (!fileVersion) {
        res.status(404).json({
          success: false,
          data: `Could not locate file version "${req.params.version}"`
        });
      }

      const fs = getFileStreamFromS3(
        `${fileInterface.file.fileKey}_${fileVersion.fileHash}`,
        req.app.get(constants.s3ParamName)
      );
      res.attachment(
        `${basename(
          fileInterface.file.fileName,
          extname(fileInterface.file.fileName)
        )}_${version}${extname(fileInterface.file.fileName)}`
      );
      fs.pipe(res);
    } catch (e) {
      next(e);
    }
  }

  static async share(req, res, next) {
    try {
      const fileKey = req.params.fileKey;
      const fileInterface = await fileJs.bind(req.user, fileKey);

      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${fileKey}`
        });
        return next();
      }

      if (!req.body.member || !util.isAddress(req.body.member)) {
        res.status(400).json({
          success: false,
          data: `Missing or invalid member address`
        });
      }

      const result = await fileInterface.share(req.body.member);
      if (result == "0") {
        res.status(400).json({
          success: false,
          data: `Invalid member or user does not have permission`
        });
      }

      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }

  static async remove(req, res, next) {
    try {
      const fileKey = req.params.fileKey;
      const fileInterface = await fileJs.bind(req.user, fileKey);

      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${fileKey}`
        });
        return next();
      }

      if (!req.body.member || !util.isAddress(req.body.member)) {
        res.status(400).json({
          success: false,
          data: `Missing or invalid member address`
        });
        return next();
      }

      const result = await fileInterface.remove(req.body.member);
      if (result == "0") {
        res.status(400).json({
          success: false,
          data: `Invalid member or user does not have permission`
        });
        return next();
      }

      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }

  static async transfer(req, res, next) {
    try {
      const fileKey = req.params.fileKey;
      const fileInterface = await fileJs.bind(req.user, fileKey);

      if (!fileInterface) {
        res.status(404).json({
          success: false,
          data: `Unable to locate file with key ${fileKey}`
        });
        return next();
      }

      if (!req.body.member || !util.isAddress(req.body.member)) {
        res.status(400).json({
          success: false,
          data: `Missing or invalid member address`
        });
        return next();
      }

      const result = await fileInterface.transferOwnership(req.body.member);
      if (result == "0") {
        res.status(400).json({
          success: false,
          data: `Invalid member or user does not have permission`
        });
        return next();
      }

      const file = await fileInterface.getFile();
      rest.response.status200(res, file);
    } catch (e) {
      next(e);
    }
  }
}

export default FilesController;
