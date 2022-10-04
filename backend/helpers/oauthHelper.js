import { rest, oauthUtil } from "blockapps-rest";
import jwtDecode from "jwt-decode";
import config from "../load.config";

const oauth = oauthUtil.init(config.nodes[0].oauth[0]);
const oauth2 = oauthUtil.init(config.nodes[0].oauth[1]);

const CACHED_DATA = {
  serviceToken: null,
  serviceTokenExpiresAt: null,
  authToken: null,
  authTokenExpiresAt: null
};

const SERVICE_TOKEN_LIFETIME_RESERVE_SECONDS = 5;

const options = { config };

const getEmailIdFromToken = function (accessToken) {
  return jwtDecode(accessToken)["username"];
};

async function createStratoUser(userArgs) {
  try {
    let user = await rest.createUser(userArgs, options);
    return user;
  } catch (e) {
    console.error(e);
    return {
      status: e.response
        ? e.response.status
        : e.code
          ? e.code
          : "NO_CONNECTION",
      message: `error while creating user`
    };
  }
}

const getUsernameFromDecodedToken = decodedToken => {
  const {
    tokenUsernameProperty,
    tokenUsernamePropertyServiceFlow
  } = config.nodes[0].oauth[1];
  let username;
  if (decodedToken[tokenUsernameProperty]) {
    username = decodedToken[tokenUsernameProperty];
  } else if (decodedToken[tokenUsernamePropertyServiceFlow]) {
    username = decodedToken[tokenUsernamePropertyServiceFlow];
  } else {
    username = decodedToken.username;
  }
  return username;
};

const getCredentialsFromToken = token => {
  const username = getUsernameFromDecodedToken(jwtDecode(token));
  return { username, token };
};

const getCredentialsFromTokenEnv = envVariable => {
  const token = process.env[envVariable];
  if (!token) throw new Error(`Env variable ${envVariable} is not set`);
  return getCredentialsFromToken(token);
};

const getToken = async (flow) => {
  try {
    let token = flow === "service" ?
      CACHED_DATA.serviceToken : CACHED_DATA.authToken;
    const expiresAt = flow === "service" ?
      CACHED_DATA.serviceTokenExpiresAt : CACHED_DATA.authTokenExpiresAt;
    if (
      !token ||
      !expiresAt ||
      expiresAt <=
      Math.floor(Date.now() / 1000) + SERVICE_TOKEN_LIFETIME_RESERVE_SECONDS
    ) {
      let authtype;
      let tokenObj;

      if (flow === "service") {
        authtype = 0;
        tokenObj = await oauth.getAccessTokenByClientSecret();
      } else {
        authtype = 1;
        tokenObj = await oauth2.getAccessTokenByAuthCode();
        // tokenObj = await oauth2.getAccessTokenByClientSecret();
      }
      token =
        tokenObj.token[
        config.nodes[0].oauth[authtype].tokenField
          ? config.nodes[0].oauth[authtype].tokenField
          : "access_token"
        ];
      if (flow === "service") {
        CACHED_DATA.serviceToken = token;
        CACHED_DATA.serviceTokenExpiresAt = Math.floor(
          tokenObj.token.expires_at / 1000
        );
      } else {
        CACHED_DATA.authToken = token;
        CACHED_DATA.authTokenExpiresAt = Math.floor(
          tokenObj.token.expires_at / 1000
        );
      }
    }
    return token;
  } catch(e) {
    console.log("------- Error -------");
    console.log(e);
    console.log("---------------------");
  };
};

export default {
  getEmailIdFromToken,
  createStratoUser,
  getCredentialsFromToken,
  getUsernameFromDecodedToken,
  getCredentialsFromTokenEnv,
  getToken
};
