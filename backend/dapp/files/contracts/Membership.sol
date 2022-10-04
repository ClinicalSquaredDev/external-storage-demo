contract Membership {
  string public fileKey;
  string public action;
  address public member;
  uint public timestamp;

  constructor(address _member, string _action, string _fileKey) {
    member = _member;
    action = _action;
    fileKey = _fileKey;
    timestamp = now;
  }
}