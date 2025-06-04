// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {Audit} from "../src/Audit.sol";

contract AuditTest is Test {
    Audit audit;

    function setUp() public {
        audit = new Audit();
    }

    function test_addAuditLog() public {
        audit.addAuditLog("accessor1", keccak256("epd1"), "write", keccak256("aaaaaaa"));

        Audit.AuditEntry memory entry = audit.getAccessorLogByIndex("accessor1", 0);

        assertEq(entry.accessorWallet, "accessor1");
        assertEq(entry.epdId, keccak256("epd1"));
        assertEq(entry.accessType, "write");
        assertEq(audit.getAccessorLogCount("accessor1"), 1);
    }
}
