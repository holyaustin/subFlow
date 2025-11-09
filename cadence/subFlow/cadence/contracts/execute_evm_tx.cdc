// cadence/execute_evm_tx.cdc
// Execute a pre-signed EVM transaction via Flow EVM service.
// Import uses the testnet service address mapping from flow.json

import EVM from 0x8c5303eaa26202d6

transaction(rlpTx: [UInt8], coinbase: [UInt8; 20]) {
  prepare(signer: &Account) {
    // Convert coinbase byte array into EVMAddress
    let coinbaseAddr = EVM.EVMAddress(bytes: coinbase)

    // Run the signed RLP transaction on Flow EVM
    let runResult = EVM.run(tx: rlpTx, coinbase: coinbaseAddr)

    // Logging for debugging
    log("EVM.run status: ".concat(runResult.status.toString()))
    log("EVM.run gasUsed: ".concat(runResult.gasUsed.toString()))

    // Decide what counts as success for your workflow:
    // - If you want to require full success, assert successful:
    assert(
      runResult.status == EVM.Status.successful,
      message: "EVM.run did not complete successfully: ".concat(runResult.status.toString())
    )

    // Optional: you can also emit events or write state here if needed.
  }

  execute {
    // nothing here: we did the work in prepare()
  }
}
