import RestStatus from "http-status-codes";
import { rest, util, importer } from "blockapps-rest";
const { createContract, getState, call, RestError } = rest;

const contractName = "UserManager";
const contractFilename = `${util.cwd}/dapp/lib/auth/user/contracts/UserManager.sol`;

import * as userJs from "./user";

async function uploadContract(admin, options) {
  // NOTE: in production, the contract is created and owned by the AdminInterface
  // for testing purposes the creator is the admin user
  const args = { owner: admin.address };
  const contractArgs = {
    name: contractName,
    source: await importer.combine(contractFilename),
    args: util.usc(args)
  };
  const contract = await createContract(admin, contractArgs, options);
  contract.src = "removed";
  return bind(admin, contract);
}

function bind(admin, contract, options) {
  contract.getState = async function() {
    return await getState(contract, options);
  };
  contract.createUser = async function(args) {
    return await createUser(admin, contract, args, options);
  };
  contract.exists = async function(username) {
    return await exists(admin, contract, username, options);
  };
  contract.getUser = async function(username) {
    return await getUser(admin, contract, username, options);
  };
  contract.getUsers = async function() {
    return await getUsers(admin, contract, options);
  };
  return contract;
}

// throws: RestStatus
// returns: user record from search
async function createUser(admin, contract, args, options) {
  // function createUser(address account, string username, bytes32 pwHash, uint role) returns (ErrorCodes) {
  const callArgs = {
    contract,
    method: "createUser",
    args: util.usc(args)
  };

  // create the user, with the eth account
  const [restStatus] = await call(admin, callArgs, options);
  // TODO:  add RestStatus api call. No magic numbers
  if (restStatus != RestStatus.CREATED) {
    throw new RestError(restStatus, callArgs.method, callArgs.args);
  }
  // block until the user shows up in search
  const user = await getUser(admin, contract, args.username, options);
  return user;
}

async function exists(admin, contract, username, options) {
  // function exists(string username) returns (bool) {
  const args = {
    username: username
  };

  const callArgs = {
    contract,
    method: "exists",
    args: util.usc(args)
  };

  const result = await call(admin, callArgs, options);
  const exist = result[0] === true;
  return exist;
}

async function getUser(admin, contract, username, options) {
  // function getUser(string username) returns (address) {
  const args = {
    username: username
  };

  const callArgs = {
    contract,
    method: "getUser",
    args: util.usc(args)
  };

  // get the use address
  const [address] = await call(admin, callArgs, options);
  if (address == 0) {
    throw new RestError(RestStatus.NOT_FOUND, callArgs.method, args);
  }
  // found - query for the full user record
  return await userJs.getUserByAddress(admin, address, options);
}

async function getUsers(admin, contract, options) {
  const { users: usersHashmap } = await rest.getState(admin, contract, options);
  const { values } = await getState(
    admin,
    { name: "Hashmap", address: usersHashmap },
    options
  );
  const addresses = values.slice(1);
  return await userJs.getUsers(admin, addresses, options);
}

export { uploadContract, contractName, bind };
