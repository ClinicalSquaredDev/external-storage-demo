import RestStatus from "http-status-codes";
import { rest } from "blockapps-rest";
import oauthHelper from "../../../helpers/oauthHelper";
import dappJs from "../../../dapp/dapp/dapp";
import constants from "../../../helpers/constants";
import config from "../../../load.config";

class UserController {
  static async me(req, res, next) {
    try {
      const deploy = req.app.get(constants.deployParamName);
      const dapp = await dappJs.bind(req.user, deploy.dapp.contract, {
        config
      });
      try {
        const dappUser = await dapp.getUser(req.decodedToken.username);
        rest.response.status200(res, dappUser);
      } catch (e) {
        // create user
        if (
          e.response &&
          e.response.status &&
          e.response.status == RestStatus.NOT_FOUND
        ) {
          const serviceUserToken = await oauthHelper.getToken("code");
          const deploy = req.app.get(constants.deployParamName);
          const adminDapp = await dappJs.bind(
            { token: serviceUserToken },
            deploy.dapp.contract,
            {
              config
            }
          );
          const dappUser = await adminDapp.createUser({
            account: req.user.address,
            username: req.decodedToken.username,
            role: 1
          });
          rest.response.status200(res, dappUser);
        } else {
          next(e);
        }
      }
    } catch (e) {
      next(e);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const deploy = req.app.get(constants.deployParamName);
      const dapp = await dappJs.bind(req.user, deploy.dapp.contract, {
        config
      });
      const users = await dapp.getUsers();
      rest.response.status200(res, users);
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
