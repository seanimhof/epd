// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Registry.sol";

contract RegistryTest is Test {
    Registry registry;

    function setUp() public {
        registry = new Registry();
    }

    function testInsertEPD() public {
        bytes32 id = sha256(abi.encodePacked("756.1234.5678.9701.01.2000"));
        registry.insertEPD(id, "eSanita", "https://eSanita.ch");

        (string memory epdProviderName, string memory contactInfo) = registry.searchEPD(id);
        assertEq(epdProviderName, "eSanita");
        assertEq(contactInfo, "https://eSanita.ch");
    }

    function testUpdateEPD() public {
        bytes32 id = sha256(abi.encodePacked("756.1234.5678.9901.01.2000"));
        registry.insertEPD(id, "eSanita", "https://eSanita.ch");
        
        registry.updateEPD(id, "Emedo", "https://emedo.ch");
        
        (string memory epdProviderName, string memory contactInfo) = registry.searchEPD(id);
        assertEq(epdProviderName, "Emedo");
        assertEq(contactInfo, "https://emedo.ch");
    }

    function testDeleteEPD() public {
        bytes32 id = sha256(abi.encodePacked("756.1234.5678.9901.01.2000"));
        registry.insertEPD(id, "eSanita", "https://eSanita.ch");
        
        registry.deleteEPD(id);
        
        vm.expectRevert(bytes("EPD with this ID not found"));
        registry.searchEPD(id);
    }

    function testPreventDuplicateInsert() public {
        bytes32 id = sha256(abi.encodePacked("756.1234.5678.9901.01.2000"));
        registry.insertEPD(id, "eSanita", "https://eSanita.ch");
        
        vm.expectRevert(bytes("EPD with this ID already exists"));
        registry.insertEPD(id, "eSanita", "https://eSanita.ch");
    }

    function testPreventUpdateNonExistentEPD() public {
        bytes32 nonExistentId = sha256(abi.encodePacked("756.0000.0000.0001.01.2000"));
        
        vm.expectRevert(bytes("ID not found"));
        registry.updateEPD(nonExistentId, "Emedo", "https://emedo.ch");
    }

    function testPreventDeleteNonExistentEPD() public {
        bytes32 nonExistentId = sha256(abi.encodePacked("756.0000.0000.0001.01.2000"));
        
        vm.expectRevert(bytes("EPD with this ID not found"));
        registry.deleteEPD(nonExistentId);
    }
}
