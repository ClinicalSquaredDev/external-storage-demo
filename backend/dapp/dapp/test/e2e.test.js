// TODO: remove this if not in use
import { assert } from "blockapps-rest";
import RestStatus from "http-status-codes";
import config from "../../../load.config";
import oauthHelper from "../../../helpers/oauthHelper";
import dappJs from "../dapp";
import dotenv from "dotenv";

if (!process.env.USER1_TOKEN || !process.env.USER2_TOKEN) {
  dotenv.config();
}

const testName = "e2e.test";
const options = { config, name: testName, logger: console };

describe("E2E tests", function() {
  this.timeout(config.timeout);
  let admin;
  let adminCredentials;
  let dapp;

  before(async () => {
    let serviceUserToken;

    assert.isDefined(process.env.USER1_TOKEN);
    assert.isNotEmpty(process.env.USER1_TOKEN);
    assert.isDefined(process.env.USER2_TOKEN);
    assert.isNotEmpty(process.env.USER2_TOKEN);

    try {
      serviceUserToken = await oauthHelper.getServiceToken();
    } catch (e) {
      console.error(
        "ERROR: Unable to fetch the service user token, check your OAuth settings in config",
        e
      );
      throw e;
    }
    adminCredentials = { token: serviceUserToken };
    const adminEmail = oauthHelper.getEmailIdFromToken(serviceUserToken);
    console.log("Creating admin", adminEmail);
    const admin = await oauthHelper.createStratoUser(adminCredentials);
    assert.isDefined(admin);
    assert.isDefined(admin.token);
    assert.isDefined(admin.address);
    dapp = await dappJs.uploadContract(admin, options);
  });

  it("should get valid deployment state", async () => {
    const state = await dapp.getState();
    assert.isDefined(state.owner);
  });

  it("should be able to create a user", async () => {
    const stratoUser = await oauthHelper.createStratoUser({
      token: process.env.USER1_TOKEN
    });

    const dappUser = await dapp.createUser({
      account: stratoUser.address,
      username: oauthHelper.getEmailIdFromToken(stratoUser.token),
      role: 1
    });

    assert.isDefined(dappUser);
    assert.isDefined(dappUser.username);
    assert.equal(
      dappUser.username,
      oauthHelper.getEmailIdFromToken(stratoUser.token)
    );
  });

  it("should be able to query users", async () => {
    const stratoUser = await oauthHelper.createStratoUser({
      token: process.env.USER2_TOKEN
    });

    const dappUser = await dapp.createUser({
      account: stratoUser.address,
      username: oauthHelper.getEmailIdFromToken(stratoUser.token),
      role: 1
    });

    const users = await dapp.getUsers();

    assert.isArray(users);
    assert.isAtLeast(users.length, 1);
  });
});
