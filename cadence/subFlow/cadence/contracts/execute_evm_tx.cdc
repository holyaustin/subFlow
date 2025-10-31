// cadence/execute_evm_tx.cdc

// Import the EVM service interface for your network.
// NOTE: Replace `0xEVM_SERVICE_ADDRESS` with the correct Cadence address for the EVM service on Flow EVM Testnet   0x918d504533036a99.

import EVM from 0x8c5303eaa26202d6

transaction(rlpTx: [UInt8], coinbase: [UInt8; 20]) {
    prepare(acct: AuthAccount) {
        // Convert coinbase bytes to an EVMAddress type if needed
        // Some docs suggest you may need to wrap coinbase into EVM.EVMAddress(bytes: …)
        let result = EVM.run(rlpTx, coinbase)
        log("EVM.run result status: ".concat(result.toString()))
    }
    execute {
        // Optionally: log or emit something after execution
        log("Execute was successful")
    }
}
