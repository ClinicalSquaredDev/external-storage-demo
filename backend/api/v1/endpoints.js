export const users = {
  prefix: "/users",
  getUsers: "/",
  me: "/me"
};

export const authentication = {
  prefix: "/authentication",
  callback: "/callback",
  logout: "/logout"
};

export const files = {
  prefix: "/files",
  uploadFile: "/",
  getFiles: "/",
  downloadFile: "/:fileKey/versions/:version",
  attestFile: "/:fileKey/versions/:version/attest",
  members: "/:fileKey/members",
  getFile: "/:fileKey",
  transfer: "/:fileKey/transfer",
  uploadVersion: "/:fileKey/versions"
};
