import dotenv from "dotenv";
import config from "../../load.config";
import { assert, util } from "blockapps-rest";
import { get, postFile, downloadFile, post, del } from "../helpers/rest";
import { files, users } from "../../api/v1/endpoints";
import oauthHelper from "../../helpers/oauthHelper";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import constants from "../../helpers/constants";
import { join, basename, extname } from "path";

if (!process.env.USER1_TOKEN || !process.env.USER2_TOKEN) {
  dotenv.config();
}

function generateRandomFile() {
  if (!existsSync(constants.tempUploadDir)) {
    mkdirSync(constants.tempUploadDir);
  }
  const filePath = join(constants.tempUploadDir, `${util.uid("test")}.txt`);
  writeFileSync(filePath, util.uid("data"));
  const fileDescription = util.uid("fileDescription");
  const comments = util.uid("comments");

  return { filePath, fileDescription, comments };
}

describe("Files E2E", function() {
  this.timeout(config.timeout);
  let user1;
  let user2;

  before(async () => {
    assert.isDefined(process.env.USER1_TOKEN);
    assert.isDefined(process.env.USER2_TOKEN);
    user1 = await get(users.prefix, users.me, null, process.env.USER1_TOKEN);
    user2 = await get(users.prefix, users.me, null, process.env.USER2_TOKEN);
  });

  it(`POST ${files.prefix}${files.uploadFile}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));
  });

  it(`POST ${files.prefix}${files.attestFile}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));

    const attestResponse = await postFile(
      files.prefix,
      files.attestFile
        .replace(":fileKey", response.body.data.fileKey)
        .replace(":version", "1"),
      filePath,
      "",
      "",
      process.env.USER1_TOKEN
    );

    assert.equal(attestResponse.statusCode, 200);
    assert.isDefined(attestResponse.body);
    assert.isOk(attestResponse.body.success);
    assert.isDefined(attestResponse.body.data);
    assert.isDefined(attestResponse.body.data.auditLog);
    assert.isArray(attestResponse.body.data.auditLog);
    assert.equal(
      attestResponse.body.data.auditLog.length,
      response.body.data.auditLog.length + 1
    );
  });

  it(`GET ${files.prefix}${files.getFile}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));

    const getFileResponse = await get(
      files.prefix,
      files.getFile.replace(":fileKey", response.body.data.fileKey),
      null,
      process.env.USER1_TOKEN
    );

    assert.equal(getFileResponse.statusCode, 200);
    assert.isDefined(getFileResponse.body);
    assert.isOk(getFileResponse.body.success);
    assert.isDefined(getFileResponse.body.data);
    assert.isDefined(getFileResponse.body.data.fileName);
    assert.equal(getFileResponse.body.data.fileName, basename(filePath));
  });

  it(`POST ${files.prefix}${files.members}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));

    let getFileResponse = await get(
      files.prefix,
      files.getFile.replace(":fileKey", response.body.data.fileKey),
      null,
      process.env.USER2_TOKEN
    );

    assert.equal(getFileResponse.statusCode, 404);

    const shareResponse = await post(
      files.prefix,
      files.members.replace(":fileKey", response.body.data.fileKey),
      { member: user2.body.data.account },
      process.env.USER1_TOKEN
    );

    assert.equal(shareResponse.statusCode, 200);
    assert.isDefined(shareResponse.body);
    assert.isOk(shareResponse.body.success);
    assert.isDefined(shareResponse.body.data);

    getFileResponse = await get(
      files.prefix,
      files.getFile.replace(":fileKey", response.body.data.fileKey),
      null,
      process.env.USER2_TOKEN
    );

    assert.equal(getFileResponse.statusCode, 200);
    assert.isDefined(getFileResponse.body);
    assert.isOk(getFileResponse.body.success);
    assert.isDefined(getFileResponse.body.data);
    assert.isDefined(getFileResponse.body.data.fileName);
    assert.equal(getFileResponse.body.data.fileName, basename(filePath));
  });

  it(`GET ${files.prefix}${files.downloadFile}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));

    const fileResponse = await downloadFile(
      files.prefix,
      files.downloadFile
        .replace(":fileKey", response.body.data.fileKey)
        .replace(":version", "1"),
      process.env.USER1_TOKEN
    );

    const file = response.body.data;
    assert.equal(fileResponse.statusCode, 200);
    assert.isDefined(fileResponse.headers["content-disposition"]);
    assert.equal(
      fileResponse.headers["content-disposition"],
      `attachment; filename="${basename(
        file.fileName,
        extname(file.fileName)
      )}_1${extname(file.fileName)}"`
    );
  });

  it(`GET ${files.prefix}${files.getFiles}`, async () => {
    const response = await get(
      files.prefix,
      files.getFiles,
      null,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200, "endpoint returns 200 OK");
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isArray(response.body.data);
  });

  it(`POST ${files.prefix}${files.transfer}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));
    assert.equal(response.body.data.owner.address, user1.body.data.account);

    const transferResponse = await post(
      files.prefix,
      files.transfer.replace(":fileKey", response.body.data.fileKey),
      { member: user2.body.data.account },
      process.env.USER1_TOKEN
    );

    assert.equal(transferResponse.statusCode, 200);
    assert.isDefined(transferResponse.body);
    assert.isOk(transferResponse.body.success);
    assert.isDefined(transferResponse.body.data);
    assert.equal(
      transferResponse.body.data.owner.address,
      user2.body.data.account
    );
  });

  it(`DELETE ${files.prefix}${files.members}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));
    assert.equal(response.body.data.owner.address, user1.body.data.account);

    const transferResponse = await post(
      files.prefix,
      files.transfer.replace(":fileKey", response.body.data.fileKey),
      { member: user2.body.data.account },
      process.env.USER1_TOKEN
    );

    assert.equal(transferResponse.statusCode, 200);
    assert.isDefined(transferResponse.body);
    assert.isOk(transferResponse.body.success);
    assert.isDefined(transferResponse.body.data);
    assert.equal(
      transferResponse.body.data.owner.address,
      user2.body.data.account
    );

    const removeResponse = await del(
      files.prefix,
      files.members.replace(":fileKey", response.body.data.fileKey),
      { member: user1.body.data.account },
      process.env.USER2_TOKEN
    );
    assert.equal(removeResponse.statusCode, 200);

    const getFileResponse = await get(
      files.prefix,
      files.getFile.replace(":fileKey", response.body.data.fileKey),
      null,
      process.env.USER1_TOKEN
    );

    assert.equal(getFileResponse.statusCode, 404);
  });

  it(`POST ${files.prefix}${files.uploadVersion}`, async () => {
    const { filePath, fileDescription, comments } = generateRandomFile();
    const response = await postFile(
      files.prefix,
      files.uploadFile,
      filePath,
      fileDescription,
      comments,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200);
    assert.isDefined(response.body);
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isDefined(response.body.data.fileName);
    assert.isDefined(response.body.data.fileDescription);
    assert.equal(response.body.data.fileDescription, fileDescription);
    assert.equal(response.body.data.fileName, basename(filePath));
    assert.equal(response.body.data.owner.address, user1.body.data.account);

    const newVersion = generateRandomFile();
    const uploadVersionResponse = await postFile(
      files.prefix,
      files.uploadVersion.replace(":fileKey", response.body.data.fileKey),
      newVersion.filePath,
      newVersion.fileDescription,
      newVersion.comments,
      process.env.USER1_TOKEN
    );

    assert.equal(uploadVersionResponse.statusCode, 200);
    assert.isDefined(uploadVersionResponse.body);
    assert.isOk(uploadVersionResponse.body.success);
    assert.isDefined(uploadVersionResponse.body.data);
    assert.isArray(uploadVersionResponse.body.data.versions);
    assert.equal(uploadVersionResponse.body.data.versions.length, 2);
  });
});
