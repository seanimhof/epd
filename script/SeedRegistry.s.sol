// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/Registry.sol";

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

        for(uint256 i = 0; i < data.length; i++) {
            bytes32 id = sha256(abi.encodePacked(data[i].ahv, data[i].birthdate));
            console2.logBytes32(id);
            console.log(data[i].record.epdProviderName);
            registry.insertEPD(id, data[i].record.epdProviderName, data[i].record.contactInfo);
        }

        console.log("Seeding complete. Registry address:", address(registry));

        vm.stopBroadcast();
    }

    function init() internal {
        data.push(SampleData({
            ahv: "756.1234.5678.90",
            birthdate: "01.01.2002",
            record: Registry.Record({
                epdProviderName: "eSanita",
                contactInfo: "https://eSanita.ch",
                exist: true
            })})
        );

        data.push(SampleData({
            ahv: "756.0987.6543.21",
            birthdate: "31.12.1999",
            record: Registry.Record({
                epdProviderName: "Emedo",
                contactInfo: "https://emedo.ch",
                exist: true
            })})
        );

        data.push(SampleData({
                ahv: "756.1212.1212.12",
                birthdate: "06.06.1985",
                record: Registry.Record({
                    epdProviderName: unicode"Dossier Santé",
                    contactInfo: "https://sante.ch",
                    exist: true

                })
            })
        );
    }
}
