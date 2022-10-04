/**
 * Util contract
 */
contract Util {
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint256 charCount = 0;
        for (charCount = 0; charCount < 32; charCount++) {
            bytes1 char = bytes1(
                (uint256(x) >> ((32 - charCount - 1) * 8)) & 0xFF
            );
            if (char == 0) {
                break;
            }
            bytesString[charCount] = char;
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (uint256 j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function b32(string memory source) returns (bytes32) {
        return stringToBytes32(source);
    }

    function i2b32(uint256 source) returns (bytes32) {
        return stringToBytes32(uintToString(source));
    }

    function a2b32(uint256[] source) returns (bytes32[]) {
        uint256 len = source.length;
        bytes32[] memory result = new bytes32[](len);
        for (uint256 i = 0; i < source.length; i++) {
            result[i] = stringToBytes32(uintToString(source[i]));
        }
        return result;
    }

    function uintToString(uint256 v) constant returns (string str) {
        if (v == 0) return "0";

        uint256 maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint256 i = 0;
        while (v != 0) {
            uint256 remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(48 + remainder);
        }
        bytes memory s = new bytes(i);
        for (uint256 j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1];
        }
        str = string(s);
    }

    function utfStringLength(string str)
        constant
        returns (uint256 characterCount)
    {
        uint256 i = 0;
        bytes memory byteArray = bytes(str);

        while (i < byteArray.length) {
            if (byteArray[i] >> 7 == 0) i += 1;
            else if (byteArray[i] >> 5 == 0x6) i += 2;
            else if (byteArray[i] >> 4 == 0xE) i += 3;
            else if (byteArray[i] >> 3 == 0x1E)
                i += 4; //For safety
            else i += 1;

            characterCount++;
        }
    }
}
