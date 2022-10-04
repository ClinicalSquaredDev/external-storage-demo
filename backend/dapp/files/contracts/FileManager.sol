import "./ExternalFile.sol";
import "./Membership.sol";

contract FileManager {
    uint256 public numVersions;
    string public fileKey;
    string public fileName;
    string public fileDescription;
    uint256 public createdAt;
    uint256 public lastActivityAt;
    address public owner;
    bool public isInitialized;
    Membership[] public memberships;
    ExternalFile[] fileVersions;

    event MemberAdded(address member, string enode);
    event MemberRemoved(address member);

    function initialize(
        string _fileKey,
        string _fileName,
        string _fileDescription,
        string _comments,
        string _fileHash,
        string _uri
    ) public {
        numVersions = 0;
        isInitialized = true;
        fileKey = _fileKey;
        fileName = _fileName;
        fileDescription = _fileDescription;
        addFileVersion(_fileHash, _comments, _uri);
        createdAt = now;
        lastActivityAt = now;
        owner = msg.sender;
    }

    function addFileVersion(
        string _fileHash,
        string _comments,
        string _uri
    ) public {
        numVersions++;
        ExternalFile file = new ExternalFile(
            fileKey,
            _fileHash,
            _uri,
            _comments,
            msg.sender,
            numVersions
        );
        fileVersions.push(file);
    }

    function transferOwnership(address newOwner, string enode)
        public
        returns (uint256)
    {
        if (msg.sender == owner) {
            uint256 status = share(newOwner, enode);
            if (status == 0) return status;
            owner = newOwner;
            lastActivityAt = now;
            return 1;
        } else {
            return 0;
        }
    }

    function share(address member, string enode) public returns (uint256) {
        emit MemberAdded(member, enode);
        memberships.push(new Membership(member, "MEMBER_ADDED", fileKey));
        if (member.balance == 0) member.transfer(1000000000000000000000);
        lastActivityAt = now;
        return 1;
    }

    function remove(address member) public returns (uint256) {
        if (msg.sender == owner && member != owner) {
            emit MemberRemoved(member);
            memberships.push(new Membership(member, "MEMBER_REMOVED", fileKey));
            lastActivityAt = now;
            return 1;
        }
        return 0;
    }

    function attest(uint256 version) public returns (uint256) {
        lastActivityAt = now;
        return fileVersions[version - 1].attest(msg.sender);
    }
}
