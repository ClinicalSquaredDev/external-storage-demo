import chai from "chai";
import chaiHttp from "chai-http";
import config from "../../load.config";
import server from "../../index";
import constants from "../../helpers/constants";
import { readFileSync } from "fs";
import { basename } from "path";

chai.use(chaiHttp);

const getUrl = (prefix, endpoint) => constants.baseUrl + prefix + endpoint;

export const get = async (
  prefix,
  endpoint,
  query,
  accessToken = null,
  headers = {}
) => {
  if (accessToken) {
    const request = chai
      .request(server)
      .get(getUrl(prefix, endpoint))
      .set(
        "Cookie",
        `${config.nodes[0].oauth2.appTokenCookieName}=${accessToken}`
      );
    Object.keys(headers).forEach(header =>
      request.set(header, headers[header])
    );
    return request.query(query);
  }

  return chai
    .request(server)
    .get(getUrl(prefix, endpoint))
    .query(query);
};

export const post = async (prefix, endpoint, body, accessToken = null) => {
  return accessToken
    ? await chai
        .request(server)
        .post(getUrl(prefix, endpoint))
        .set(
          "Cookie",
          `${config.nodes[0].oauth2.appTokenCookieName}=${accessToken}`
        )
        .send(body)
    : await chai
        .request(server)
        .post(getUrl(prefix, endpoint))
        .send(body);
};

export const del = async (prefix, endpoint, body, accessToken = null) => {
  return accessToken
    ? await chai
        .request(server)
        .delete(getUrl(prefix, endpoint))
        .set(
          "Cookie",
          `${config.nodes[0].oauth2.appTokenCookieName}=${accessToken}`
        )
        .send(body)
    : await chai
        .request(server)
        .delete(getUrl(prefix, endpoint))
        .send(body);
};

export const postFile = async (
  prefix,
  endpoint,
  filePath,
  fileDescription,
  comments,
  accessToken = null
) => {
  return accessToken
    ? await chai
        .request(server)
        .post(getUrl(prefix, endpoint))
        .field("fileDescription", fileDescription)
        .field("comments", comments)
        .set(
          "Cookie",
          `${config.nodes[0].oauth2.appTokenCookieName}=${accessToken}`
        )
        .attach(
          constants.fileUploadFieldName,
          readFileSync(filePath),
          basename(filePath)
        )
    : await chai
        .request(server)
        .post(getUrl(prefix, endpoint))
        .field("description", description)
        .attach(
          constants.fileUploadFieldName,
          readFileSync(filePath),
          basename(filePath)
        );
};

const binaryParser = function(res, cb) {
  res.setEncoding("binary");
  res.data = "";
  res.on("data", function(chunk) {
    res.data += chunk;
  });
  res.on("end", function() {
    cb(null, new Buffer(res.data, "binary"));
  });
};

export const downloadFile = async (prefix, endpoint, accessToken = null) => {
  const request = chai
    .request(server)
    .get(getUrl(prefix, endpoint))
    .set(
      "Cookie",
      `${config.nodes[0].oauth2.appTokenCookieName}=${accessToken}`
    );

  return request.buffer().parse(binaryParser);
};
