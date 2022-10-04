contract Attestation {
  uint public version;
  string public fileKey;
  address public attestor;
  uint public timestamp;

  constructor(address _attestor, string _fileKey, uint _version) {
    attestor = _attestor;
    fileKey = _fileKey;
    version = _version;
    timestamp = now;
  }
}