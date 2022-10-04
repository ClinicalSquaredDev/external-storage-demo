import "./Attestation.sol";

contract ExternalFile {
    uint256 public version;
    string public fileKey;
    string public fileHash;
    string public comments;
    string public uri;
    uint256 public timestamp;
    address public uploadedBy;
    Attestation[] public attestations;

    constructor(
        string _fileKey,
        string _fileHash,
        string _uri,
        string _comments,
        address _uploadedBy,
        uint256 _version
    ) public {
        fileKey = _fileKey;
        fileHash = _fileHash;
        uri = _uri;
        uploadedBy = _uploadedBy;
        version = _version;
        timestamp = now;
        comments = _comments;
    }

    function attest(address _attestor) public returns (uint256) {
        attestations.push(new Attestation(_attestor, fileKey, version));
        return 1;
    }
}
