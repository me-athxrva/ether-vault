// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {

    mapping(string => bool) private hashes;

    function storeHash(string memory hash) public {
        hashes[hash] = true;
    }

    function verifyHash(string memory hash) public view returns (bool) {
        return hashes[hash];
    }
}