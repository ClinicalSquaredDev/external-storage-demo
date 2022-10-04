import dotenv from "dotenv";
import config from "../../load.config";
import { assert } from "blockapps-rest";
import { get } from "../helpers/rest";
import { users } from "../../api/v1/endpoints";
import oauthHelper from "../../helpers/oauthHelper";

if (!process.env.USER1_TOKEN || !process.env.USER2_TOKEN) {
  dotenv.config();
}

describe("Users E2E", function() {
  this.timeout(config.timeout);
  before(() => {
    assert.isDefined(process.env.USER1_TOKEN);
    assert.isDefined(process.env.USER2_TOKEN);
  });

  it(`GET ${users.prefix}${users.me}`, async () => {
    const response = await get(
      users.prefix,
      users.me,
      null,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200, "Me endpoint returns 200 OK");
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.equal(
      response.body.data.username,
      oauthHelper.getEmailIdFromToken(process.env.USER1_TOKEN)
    );
  });

  it(`GET ${users.prefix}${users.getUsers}`, async () => {
    await get(users.prefix, users.me, null, process.env.USER1_TOKEN);

    const response = await get(
      users.prefix,
      users.getUsers,
      null,
      process.env.USER1_TOKEN
    );

    assert.equal(response.statusCode, 200, "Me endpoint returns 200 OK");
    assert.isOk(response.body.success);
    assert.isDefined(response.body.data);
    assert.isArray(response.body.data);
    assert.isAtLeast(response.body.data.length, 1);
  });
});
