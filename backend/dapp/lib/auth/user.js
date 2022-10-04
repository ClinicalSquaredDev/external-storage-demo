import { rest, util, importer } from "blockapps-rest";
const { createContract, getState, searchUntil } = rest;

const contractName = "User";
const contractFilename = `${util.cwd}/dapp/lib/auth/user/contracts/User.sol`;

async function uploadContract(admin, args, options) {
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
    return await getState(admin, contract, options);
  };
  return contract;
}

async function getUsers(user, addresses, options) {
  // FIXME must break to batches of 50 addresses
  const csv = util.toCsv(addresses); // generate csv string

  function predicate(response) {
    return response;
  }

  const contract = {
    name: contractName
  };
  const results = await searchUntil(user, contract, predicate, {
    ...options,
    query: { address: `in.${csv}` }
  });
  return results;
}

async function getUser(user, username) {
  function predicate(response) {
    if (response.length >= 1) {
      return response;
    }
  }

  const contract = {
    name: contractName
  };

  const response = (
    await searchUntil(user, contract, predicate, {
      ...options,
      query: { username: `eq.${username}` }
    })
  )[0];
  return response;
}

async function getUserByAddress(user, address, options) {
  function predicate(response) {
    if (response.length >= 1) {
      return response;
    }
  }

  const contract = {
    name: contractName,
    address
  };
  const response = (
    await searchUntil(user, contract, predicate, {
      ...options,
      query: { address: `eq.${address}` }
    })
  )[0];
  return response;
}

export {
  uploadContract,
  bind,
  // constants
  contractName,
  // business logic
  getUserByAddress,
  getUsers,
  getUser
};
