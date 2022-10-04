/*
 * @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 * @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
contract RestStatus {
    uint256 constant OK = 200;
    uint256 constant CREATED = 201;
    uint256 constant ACCEPTED = 202;
    // TODO: Geting: Duplicate expressions value. var:INTERNAL_SERVER_ERROR value:500 (that's why commented out)
    // uint constant CLIENT_ERROR = 400; // 4xx
    uint256 constant BAD_REQUEST = 400;
    uint256 constant UNAUTHORIZED = 401;
    uint256 constant FORBIDDEN = 403;
    uint256 constant NOT_FOUND = 404;
    uint256 constant CONFLICT = 409;
    // TODO: Geting: Duplicate expressions value. var:INTERNAL_SERVER_ERROR value:500 (that's why commented out)
    // uint constant SERVER_ERROR = 500; // 5xx
    uint256 constant INTERNAL_SERVER_ERROR = 500;
    uint256 constant BAD_GATEWAY = 502;
    uint256 constant GATEWAY_TIMEOUT = 504;
}
