// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/Registry.sol";
import "../src/Audit.sol";

contract SeedRegistry is Script {
    struct SampleData {
        string ahv;
        string birthdate;
        Registry.Record record;
    }

    SampleData[] data;

    constructor() {
        init();
    }

    function run() external {
        vm.startBroadcast();

        Registry registry = Registry(vm.envAddress("CONTRACT_ADDRESS"));

        for (uint256 i = 0; i < data.length; i++) {
            bytes32 id = keccak256(abi.encodePacked(data[i].ahv, data[i].birthdate));
            console2.logBytes32(id);
            console.log(data[i].record.epdProviderName);
            registry.insertEPD(id, data[i].record.epdProviderName, data[i].record.contactInfo);
        }

        console.log("Seeding complete. Registry address:", address(registry));

        vm.stopBroadcast();
    }

    function init() internal {
        data.push(
            SampleData({
                ahv: "756.1234.5678.90",
                birthdate: "2002-01-01",
                record: Registry.Record({epdProviderName: "eSanita", contactInfo: "https://eSanita.ch", exist: true})
            })
        );

        data.push(
            SampleData({
                ahv: "756.0987.6543.21",
                birthdate: "1999-12-31",
                record: Registry.Record({epdProviderName: "Emedo", contactInfo: "https://emedo.ch", exist: true})
            })
        );

        data.push(
            SampleData({
                ahv: "756.1212.1212.12",
                birthdate: "1985-06-06",
                record: Registry.Record({
                    epdProviderName: unicode"Dossier Santé",
                    contactInfo: "https://sante.ch",
                    exist: true
                })
            })
        );
    }
}

contract SeedAudit is Script {
    struct SampleAudit {
        string accessorId;
        bytes32 epdId;
        string accessType;
        bytes32 dataHash;
        
    }

    SampleAudit[] data;

    constructor() {
        init();
    }

    function run() external {
        vm.startBroadcast();

        Audit audit = Audit(vm.envAddress("CONTRACT_ADDRESS"));

        for (uint256 i = 0; i < data.length; i++) {
            audit.addAuditLog(data[i].accessorId, data[i].epdId, data[i].accessType, keccak256("data"));
        }

        console.log("Seeding complete. Audit CA:", address(audit));

        vm.stopBroadcast();
    }

    function init() internal {
        data.push(SampleAudit({accessorId: "Artzt", epdId: keccak256("756.1234.5678.902002-01-01"), accessType: "Create EPD", dataHash: keccak256("aaaaaaaa")}));
        data.push(SampleAudit({accessorId: "Artzt", epdId: keccak256("756.0987.6543.211999-12-31"), accessType: "Create EPD", dataHash: keccak256("bbbbbbbb")}));
        data.push(SampleAudit({accessorId: "Professor Dr. Franke", epdId: keccak256("756.1212.1212.121985-06-06"), accessType: "Create EPD", dataHash: keccak256("cccccccc")}));
    }
}
