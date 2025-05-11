// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Registry {

    event EPDInserted(string indexed id, string provider);
    
    mapping(string => string) private epdRegistry;

    function searchEPD(string memory _id) public view returns (string memory) {
        require(keccak256(bytes(epdRegistry[_id])) != keccak256(bytes("")), "EPD ID not found");
        return epdRegistry[_id];
    }

    function insertEPD(string memory _id, string memory _epdProvider) public {
        epdRegistry[_id] = _epdProvider;
    }

    function updateEPD(string memory _oldId, string memory _newId, string memory _epdProvider) public {
        require(keccak256(bytes(epdRegistry[_oldId])) != keccak256(bytes("")), "Old ID not found");
        if(keccak256(bytes(_oldId)) == keccak256(bytes(_newId))) {
            epdRegistry[_oldId] = _epdProvider;
        } else {
            deleteEPD(_oldId);
            epdRegistry[_newId] = _epdProvider;
        }
    }

    function deleteEPD(string memory _id) public {
        delete epdRegistry[_id];
    }

}