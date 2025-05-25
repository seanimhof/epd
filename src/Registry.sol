// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Registry {
    struct Record {
        string epdProviderName;
        string contactInfo;
        bool exist;
    }

    event EPDInserted(string indexed id, Record record);
    event EPDUpdated(string indexed id, Record record);
    event EPDDeleted(string indexed id, Record record);

    mapping(bytes32 => Record) private epdRegistry;

    function searchEPD(bytes32 _id) public view returns (string memory, string memory) {
        require(epdRegistry[_id].exist, "EPD with this ID not found");
        return (epdRegistry[_id].epdProviderName, epdRegistry[_id].contactInfo);
    }

    function insertEPD(bytes32 _id, string calldata _epdProviderName, string calldata _contactInfo) public {
        require(!epdRegistry[_id].exist, "EPD with this ID already exists");
        epdRegistry[_id] = Record({epdProviderName: _epdProviderName, contactInfo: _contactInfo, exist: true});
        emit EPDInserted(string.concat("0x", toHexString(_id)), epdRegistry[_id]);
    }

    function updateEPD(bytes32 _id, string calldata _epdProviderName, string calldata _contactInfo) public {
        require(epdRegistry[_id].exist, "ID not found");
        epdRegistry[_id].epdProviderName = _epdProviderName;
        epdRegistry[_id].contactInfo = _contactInfo;
        emit EPDUpdated(string.concat("0x", toHexString(_id)), epdRegistry[_id]);
    }

    function deleteEPD(bytes32 _id) public {
        require(epdRegistry[_id].exist, "EPD with this ID not found");
        Record memory record = epdRegistry[_id];
        delete epdRegistry[_id];
        emit EPDDeleted(string.concat("0x", toHexString(_id)), record);
    }

    function toHexString(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            str[i * 2] = alphabet[uint8(data[i] >> 4)];
            str[1 + i * 2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}
