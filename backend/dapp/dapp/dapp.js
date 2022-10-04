import { rest, importer } from "blockapps-rest";
const { createContract, getState } = rest;
import config from "../../load.config";
import { yamlWrite, yamlSafeDumpSync } from "../../helpers/config";
import * as userManagerJs from "../lib/auth/userManager";

const contractName = "ExtFileStorageDapp";
const contractFilename = `${config.dappPath}/dapp/contracts/ExtFileStorageDapp.sol`;
const managerNames = ["userManager"];

function deploy(contract, args, options) {
  // author the deployment
  const { deployFilename } = args;

  const deployment = {
    url: options.config.nodes[0].url,
    dapp: {
      contract: {
        name: contract.name,
        address: contract.address
      }
    }
  };

  if (options.config.apiDebug) {
    console.log("deploy filename:", deployFilename);
    console.log(yamlSafeDumpSync(deployment));
  }

  yamlWrite(deployment, deployFilename);

  return deployment;
}

async function uploadContract(user, options) {
  const source = await importer.combine(contractFilename);
  const contractArgs = {
    name: contractName,
    source
  };

  const contract = await createContract(user, contractArgs, options);
  contract.src = "removed";

  return await bind(user, contract, options);
}

async function getManagers(user, contract, options) {
  const state = await getState(user, contract, options);
  const managers = managerNames.reduce((map, name) => {
    const address = state[name];
    if (address) {
      map[name] = {
        name: `${name[0].toUpperCase()}${name.substring(1)}`,
        address
      };
    }
    return map;
  }, {});
  return managers;
}

async function bind(user, _contract, options) {
  const contract = _contract;

  // set managers
  const unboundManagers = await getManagers(user, contract, options);
  const userManager = userManagerJs.bind(
    user,
    unboundManagers[managerNames[0]],
    options
  );

  contract.getState = async function(args) {
    return getState(user, contract, options);
  };

  contract.createUser = async function(args) {
    const user = await userManager.createUser(args);
    return user;
  };

  contract.getUsers = async function() {
    const users = await userManager.getUsers();
    return users;
  };

  contract.getUser = async function(username) {
    const user = await userManager.getUser(username);
    return user;
  };

  contract.deploy = function(args) {
    const deployment = deploy(contract, args, options);
    return deployment;
  };

  return contract;
}

export default {
  bind,
  uploadContract
};
