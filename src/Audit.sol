// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Audit {
    struct AuditEntry {
        uint256 timestamp;
        bytes32 accessorWallet;
        bytes32 epdId;
        string accessType;
        bytes32 dataHash;
    }

    mapping(bytes32 => uint256[]) public accessorAuditIndexes;
    mapping(bytes32 => uint256[]) public epdAuditIndexes;

    AuditEntry[] public auditLogs;

    event AuditLogged(uint256 timestamp, bytes32 accessorWallet, bytes32 epdId, string accessType, bytes32 dataHash);

    function addAuditLog(bytes32 _accessorWallet, bytes32 _epdId, string memory _accessType, bytes32 _dataHash)
        public
    {
        auditLogs.push(
            AuditEntry({
                timestamp: block.timestamp,
                accessorWallet: _accessorWallet,
                epdId: _epdId,
                accessType: _accessType,
                dataHash: _dataHash
            })
        );
        accessorAuditIndexes[_accessorWallet].push(auditLogs.length - 1);
        epdAuditIndexes[_epdId].push(auditLogs.length - 1);
        emit AuditLogged(block.timestamp, _accessorWallet, _epdId, _accessType, _dataHash);
    }

    function getAccessorLogCount(bytes32 _accessorWallet) public view returns (uint256) {
        return accessorAuditIndexes[_accessorWallet].length;
    }

    function getAccessorLogByIndex(bytes32 _accessorWallet, uint256 index) public view returns (AuditEntry memory) {
        return auditLogs[accessorAuditIndexes[_accessorWallet][index]];
    }

    function getEpdLogCount(bytes32 _epdId) public view returns (uint256) {
        return epdAuditIndexes[_epdId].length;
    }

    function getEpdLogByIndex(bytes32 _epdId, uint256 index) public view returns (AuditEntry memory) {
        return auditLogs[epdAuditIndexes[_epdId][index]];
    }
}
