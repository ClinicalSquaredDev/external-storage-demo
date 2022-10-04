import { assert, util, rest } from "blockapps-rest";
import config from "../../../load.config";
import dotenv from "dotenv";
import oauthHelper from "../../../helpers/oauthHelper";
import fileJs from "../files";

if (!process.env.USER1_TOKEN || !process.env.USER2_TOKEN) {
  dotenv.config();
}

function getFileParams() {
  return {
    fileKey: util.uid("fileKey"),
    fileName: util.uid("fileName"),
    fileDescription: util.uid("fileDescription"),
    uri: util.uid("uri"),
    comments: util.uid("comments"),
    fileHash: util.uid("fileHash")
  };
}

describe("Files tests", function() {
  this.timeout(config.timeout);
  let user1;
  let user2;

  before(async () => {
    user1 = await oauthHelper.createStratoUser({
      token: process.env.USER1_TOKEN
    });
    user2 = await oauthHelper.createStratoUser({
      token: process.env.USER2_TOKEN
    });
  });

  // upload file
  it("Should be able to upload a file", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    const file = await fileInterface.getFile();
    assert.isArray(file.versions);
    assert.isAtLeast(file.versions.length, 1);
    assert.equal(file.versions[0].fileHash, fileToBeUploaded.fileHash);
    assert.equal(file.fileName, fileToBeUploaded.fileName);
    assert.equal(file.fileDescription, fileToBeUploaded.fileDescription);
    assert.equal(file.versions[0].uri, fileToBeUploaded.uri);
    assert.equal(file.fileKey, fileToBeUploaded.fileKey);
  });

  // transfer ownership
  it("Should be able to transfer ownership", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    const result = await fileInterface.transferOwnership(user2.address);

    assert.equal(result, "1");

    const file = await fileInterface.getFile();
    if (typeof file.owner == "object")
      assert.equal(file.owner.address, user2.address);
    else assert.equal(file.owner, user2.address);
  });

  // share
  it("Should be able to share membership", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });
    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    let user2BoundInterface = await fileJs.bind(
      user2,
      fileToBeUploaded.fileKey
    );
    assert.isUndefined(user2BoundInterface);

    const result = await fileInterface.share(user2.address);
    assert.equal(result, "1");

    user2BoundInterface = await fileJs.bind(user2, fileToBeUploaded.fileKey);
    assert.isDefined(user2BoundInterface);

    const file = await user2BoundInterface.getFile();
    assert.equal(file.versions[0].fileHash, fileToBeUploaded.fileHash);
    assert.equal(file.fileName, fileToBeUploaded.fileName);
    assert.equal(file.versions[0].uri, fileToBeUploaded.uri);
    assert.equal(file.fileKey, fileToBeUploaded.fileKey);
  });

  // remove
  it("Should be able to share membership", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    let user2BoundInterface = await fileJs.bind(
      user2,
      fileToBeUploaded.fileKey
    );
    assert.isUndefined(user2BoundInterface);

    const result = await fileInterface.share(user2.address);
    assert.equal(result, "1");

    user2BoundInterface = await fileJs.bind(user2, fileToBeUploaded.fileKey);
    assert.isDefined(user2BoundInterface);

    const file = await user2BoundInterface.getFile();
    assert.equal(file.versions[0].fileHash, fileToBeUploaded.fileHash);
    assert.equal(file.fileName, fileToBeUploaded.fileName);
    assert.equal(file.versions[0].uri, fileToBeUploaded.uri);
    assert.equal(file.fileKey, fileToBeUploaded.fileKey);

    await fileInterface.remove(user2.address);
    user2BoundInterface = await fileJs.bind(user2, fileToBeUploaded.fileKey);
    assert.isUndefined(user2BoundInterface);
  });

  // attest
  it("Should be able to attest", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    let result = await fileInterface.share(user2.address);

    assert.equal(result, "1");

    const user2BoundInterface = await fileJs.bind(
      user2,
      fileToBeUploaded.fileKey
    );
    assert.isDefined(user2BoundInterface);

    result = await user2BoundInterface.attest(1);
    assert.equal(result, "1");
  });

  // getfiles
  it("Should be able to retrieve files", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    const files = await fileJs.getFiles(user1, 10, 0);
    assert.isArray(files);
    assert.isAtLeast(files.length, 1);
  });

  // addFileVersion
  it("Should be able to create new versions", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    const fileToBeUpdated = {
      uri: util.uid("uri"),
      fileHash: util.uid("fileHash"),
      comments: util.uid("comments")
    };

    await fileInterface.addFileVersion(fileToBeUpdated);

    const file = await fileInterface.getFile();
    assert.equal(file.numVersions, 2);
    assert.equal(file.versions.length, 2);
  });

  // attest
  it("Should be able to attest a specific version", async () => {
    const fileToBeUploaded = getFileParams();
    const fileInterface = await fileJs.uploadFile(user1, fileToBeUploaded, {
      config
    });

    assert.isDefined(fileInterface);
    assert.isDefined(fileInterface.name);
    assert.isDefined(fileInterface.address);

    const file2 = {
      uri: util.uid("uri"),
      fileHash: util.uid("fileHash"),
      comments: util.uid("comments")
    };

    const file3 = {
      uri: util.uid("uri"),
      fileHash: util.uid("fileHash"),
      comments: util.uid("comments")
    };

    await fileInterface.addFileVersion(file2);
    await fileInterface.addFileVersion(file3);

    let result = await fileInterface.share(user2.address);

    assert.equal(result, "1");

    const user2BoundInterface = await fileJs.bind(
      user2,
      fileToBeUploaded.fileKey
    );
    assert.isDefined(user2BoundInterface);

    result = await user2BoundInterface.attest(2);
    assert.equal(result, "1");
    result = await user2BoundInterface.attest(3);
    assert.equal(result, "1");

    const file = await user2BoundInterface.getFile();
    assert.equal(file.numVersions, 3);

    const attestations = file.auditLog.reduce((m, a) => {
      if (a.attestor) {
        return [...m, a];
      } else {
        return m;
      }
    }, []);
    assert.equal(attestations.length, 2);

    const expectedAttestations = [undefined, 0, 1, 1];
    for (let i = 1; i < expectedAttestations.length; i++) {
      const num = attestations.reduce((m, a) => {
        if (a.version === i) {
          return m + 1;
        } else {
          return m;
        }
      }, 0);
      assert.equal(num, expectedAttestations[i]);
    }
  });
});
