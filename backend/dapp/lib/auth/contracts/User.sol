/**
 * User data contract
 */
contract User {
    address public account;
    string public username;
    uint256 public role;

    // internal
    uint256 public updateCounter = 0;

    function User(
        address _account,
        string _username,
        uint256 _role
    ) {
        account = _account;
        username = _username;
        role = _role;
        updateCounter = 1; // set update counter
    }
}
