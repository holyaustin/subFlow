// cadence/execute_evm_tx.cdc
//
// Execute a pre-signed EVM transaction (RLP encoded) via Flow EVM.
// Ensure this is deployed or run against the Flow Testnet.
//
// Docs: https://developers.flow.com/blockchain-development-tutorials/cross-vm-apps/direct-calls

import EVM from 0x8c5303eaa26202d6

transaction(rlpTx: [UInt8], coinbaseBytes: [UInt8; 20]) {

    prepare(signer: &Account) {
        log("🚀 Starting execution of EVM transaction via Flow EVM bridge...")

        // Convert bytes to an EVM address object
        let coinbaseAddr = EVM.EVMAddress(bytes: coinbaseBytes)

        // Run the signed RLP transaction
        let result = EVM.run(
            tx: rlpTx,
            coinbase: coinbaseAddr
        )

        log("EVM.run completed. Status: ".concat(result.status.toString()))
        log("EVM gas used: ".concat(result.gasUsed.toString()))

        // Optional: assert for workflow safety
        assert(
            result.status == EVM.Status.successful,
            message: "❌ EVM transaction failed! Status: ".concat(result.status.toString())
        )
    }

    execute {
        log("✅ EVM transaction executed successfully on Flow EVM Testnet.")
    }
}
