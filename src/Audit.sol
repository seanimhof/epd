// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Audit {
    struct AuditEntry {
        uint256 timestamp;
        string accessorId;
        string epdId;
        string accessType;
        bytes32 dataHash;
    }

    mapping(string => uint256[]) public accessorAuditIndexes;
    mapping(string => uint256[]) public epdAuditIndexes;

    AuditEntry[] public auditLog;

    event AuditLogged(uint256 timestamp, string accessorId, string epdId, string accessType, bytes32 dataHash);

    function addAuditLog(string memory _accessorId, string memory _epdId, string memory _accessType) public {
        bytes32 dataHash = keccak256(abi.encode(_accessorId, _epdId, _accessType));
        auditLog.push(
            AuditEntry({
                timestamp: block.timestamp,
                accessorId: _accessorId,
                epdId: _epdId,
                accessType: _accessType,
                dataHash: dataHash
            })
        );
        accessorAuditIndexes[_accessorId].push(auditLog.length - 1);
        accessorAuditIndexes[_epdId].push(auditLog.length - 1);
        emit AuditLogged(block.timestamp, _accessorId, _epdId, _accessType, dataHash);
    }

    function getAccessorLogCount(string calldata _accessorId) public view returns (uint256) {
        return accessorAuditIndexes[_accessorId].length;
    }

    function getAccessorLogByIndex(string calldata _accessorId, uint256 index)
        public
        view
        returns (AuditEntry memory)
    {
        return auditLog[accessorAuditIndexes[_accessorId][index]];
    }

    function getEpdLogCount(string calldata _epdId) public view returns (uint256) {
        return accessorAuditIndexes[_epdId].length;
    }

    function getEpdLogByIndex(string calldata _epdId, uint256 index) public view returns (AuditEntry memory) {
        return auditLog[accessorAuditIndexes[_epdId][index]];
    }
}
