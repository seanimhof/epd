// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/Registry.sol";
import "../src/Audit.sol";

contract DeployRegistry is Script {
    function run() external {
        vm.startBroadcast();

        Registry registry = new Registry();
        console.log("Registry deployed at:", address(registry));

        Audit audit = new Audit();
        console.log("Audit deployed at:", address(audit));

        vm.stopBroadcast();
    }
}
