import { rest, util, importer } from "blockapps-rest";
import config from "../../load.config";
import * as url from "url";
import constants from "../../helpers/constants";
import ip from "ip";
import moment from "moment";

const contractFileName = `${config.dappPath}/files/contracts/FileManager.sol`;
const fileManagerContractName = "FileManager";
const fileContractName = "ExternalFile";
const contract = {
  name: fileManagerContractName,
  address: constants.governanceAddress
};
const enode = `enode://6d8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@${ip.address()}:30303`;

async function uploadFile(user, file, options) {
  const chainArgs = {
    label: `file_${file.fileKey}`,
    src: await importer.combine(contractFileName),
    args: {},
    members: [
      {
        address: user.address,
        enode
      }
    ],
    balances: [
      {
        address: user.address,
        balance: 1000000000000000000000
      },
      {
        address: constants.governanceAddress,
        balance: 100000000000000000000000000
      }
    ],
    fileManagerContractName
  };

  const chainId = await rest.createChain(
    user,
    chainArgs,
    { name: fileManagerContractName },
    { ...options, history: [fileManagerContractName] }
  );

  const chainOptions = { ...options, chainIds: [chainId] };

  const initializeCallArgs = {
    contract,
    method: "initialize",
    args: util.usc({ ...file })
  };

  const result = await rest.call(user, initializeCallArgs, chainOptions);

  const fileContract = await bind(user, file.fileKey);

  return fileContract;
}

async function bind(user, fileKey) {
  let file = await getFile(user, fileKey, { config });
  if (!file) {
    return undefined;
  }

  const options = {
    config,
    chainIds: [file.chainId]
  };

  const boundContract = {
    ...contract
  };

  boundContract.addFileVersion = async fileVersion => {
    return await addFileVersion(user, fileVersion, options);
  };

  boundContract.transferOwnership = async newOwner => {
    return await transferOwnership(user, newOwner, options);
  };

  boundContract.share = async member => {
    return await share(user, member, options);
  };

  boundContract.remove = async member => {
    return await remove(user, member, options);
  };

  boundContract.attest = async version => {
    return await attest(user, version, options);
  };

  boundContract.getFile = async () => {
    return await getFile(user, file.fileKey, options);
  };

  boundContract.file = file;

  return boundContract;
}

async function getFile(user, _fileKey, options) {
  const fileKey = `eq.${_fileKey}`;
  const searchOptions = {
    ...options,
    query: options.chainIds
      ? {
          fileKey
        }
      : {
          fileKey,
          chainId: `in.${util.toCsv((await getChains(user)).map(c => c.id))}`
        }
  };
  const fileManagerSearchResults = await rest.search(
    user,
    { name: fileManagerContractName },
    searchOptions
  );
  if (fileManagerSearchResults.length > 0) {
    const file = fileManagerSearchResults[0];

    const versionsQuery = await rest.search(
      user,
      { name: fileContractName },
      searchOptions
    );

    // get attestation for file
    const attestationsQuery = await rest.search(
      user,
      { name: "Attestation" },
      searchOptions
    );

    // get memberships for file
    const membershipsQuery = await rest.search(
      user,
      { name: "Membership" },
      searchOptions
    );

    // get users
    const users = await rest.search(user, { name: "User" }, { config });

    // get history
    const history = await rest.search(
      user,
      { name: `history@${fileManagerContractName}` },
      {
        config,
        query: { fileKey, chainId: `eq.${file.chainId}` }
      }
    );

    const owner = users.find(u => u.account == file.owner);
    const chains = await getChains(user, [file.chainId]);

    const members = [];
    if (chains.length > 0) {
      chains[0].info.members.forEach(m => {
        const member = users.find(u => u.account == m.address);
        if (member) {
          members.push({
            username: member.username,
            address: m.address
          });
        }
      });
    }

    const transferOwnerships = history.reduce((t, h, i) => {
      if (i == 0) {
        return t;
      }
      if (history[i - 1].owner != h.owner) {
        const member = users.find(u => u.account == h.owner);
        if (member) {
          t.push({
            action: "OWNERSHIP_TRANSFERRED",
            member: {
              username: member.username,
              address: member.account
            },
            timestamp: moment(new Date(h.block_timestamp)).unix()
          });
        }
      }
      return t;
    }, []);

    const attestations = attestationsQuery.map(a => {
      const attestor = users.find(u => u.account == a.attestor);
      if (attestor != undefined) {
        return {
          ...a,
          action: "VERIFICATION",
          attestor: {
            username: attestor.username,
            address: attestor.account
          }
        };
      }
      return a;
    });

    const versions = versionsQuery.map(v => {
      const uploadedBy = users.find(u => u.account == v.uploadedBy);
      if (uploadedBy) {
        return {
          ...v,
          action: "NEW_VERSION",
          attestations: v.attestations.map(a =>
            attestations.find(at => at.address == a)
          ),
          uploadedBy: {
            username: uploadedBy.username,
            address: uploadedBy.account
          }
        };
      }
      return v;
    });

    const memberships = membershipsQuery.map(m => {
      const member = users.find(u => u.account == m.member);
      if (member != undefined) {
        return {
          ...m,
          member: {
            username: member.username,
            address: member.account
          }
        };
      }
      return m;
    });

    const auditLog = [
      ...new Set([
        ...versions,
        ...memberships,
        ...attestations,
        ...transferOwnerships
      ])
    ];

    auditLog.sort((a, b) => a.timestamp - b.timestamp);

    return {
      ...file,
      members,
      owner: owner
        ? { username: owner.username, address: owner.account }
        : file.owner,
      versions,
      auditLog
    };
  } else {
    return undefined;
  }
}

async function getFiles(user, limit, offset) {
  const chains = await getChains(user);
  const searchOptions = {
    config,
    query: {
      limit,
      offset,
      chainId: `in.${util.toCsv(chains.map(c => c.id))}`,
      order: "createdAt"
    }
  };

  try {
    const files = await rest.search(
      user,
      { name: fileManagerContractName },
      searchOptions
    );
    // get users
    const users = await rest.search(user, { name: "User" }, { config });

    return files.map(f => {
      const owner = users.find(u => u.account == f.owner);
      if (owner) f.owner = { username: owner.username, address: owner.account };
      return f;
    });
  } catch (e) {
    return [];
  }
}

async function addFileVersion(user, fileVersion, options) {
  const addFileVersionCallArgs = {
    contract,
    method: "addFileVersion",
    args: util.usc({ ...fileVersion })
  };

  const result = await rest.call(user, addFileVersionCallArgs, options);

  return result[0];
}

async function transferOwnership(user, newOwner, options) {
  const transferOwnershipCallArgs = {
    contract,
    method: "transferOwnership",
    args: {
      newOwner,
      enode
    }
  };

  const result = await rest.call(user, transferOwnershipCallArgs, options);

  return result[0];
}

async function share(user, member, options) {
  const shareCallArgs = {
    contract,
    method: "share",
    args: {
      member,
      enode
    }
  };

  const result = await rest.call(user, shareCallArgs, options);

  return result[0];
}

async function remove(user, member, options) {
  const removeCallArgs = {
    contract,
    method: "remove",
    args: {
      member
    }
  };

  const result = await rest.call(user, removeCallArgs, options);

  return result[0];
}

async function attest(user, version, options) {
  const attestCallArgs = {
    contract,
    method: "attest",
    args: {
      version
    }
  };

  const result = await rest.call(user, attestCallArgs, options);

  return result[0];
}

async function getChains(user, chainIds = []) {
  const keyResponse = await rest.getKey(user, { config });

  const chains = await rest.getChains(user, chainIds, { config });

  return chains.filter(
    c => c.info.members.find(m => m.address == user.address) != undefined
  );
}

export default {
  uploadFile,
  bind,
  getFiles
};
