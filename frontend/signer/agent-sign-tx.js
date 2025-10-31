// signer/agent-sign-tx.js
// Node helper to build + sign an EVM tx for executePayment(subscriptionId)
// Requires: EXECUTOR_PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS

import { Wallet, providers, utils } from "ethers";
import { hexToBytes } from "viem"; // to convert signed hex to byte array
import dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://testnet.evm.nodes.onflow.org";
const EXECUTOR_PRIVATE_KEY = process.env.EXECUTOR_PRIVATE_KEY; // IMPORTANT: store securely
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // SubFlow contract address
const CHAIN_ID = Number(process.env.CHAIN_ID || 0); // set to Flow EVM testnet chain id

if (!EXECUTOR_PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("Set EXECUTOR_PRIVATE_KEY and CONTRACT_ADDRESS in .env");
  process.exit(1);
}

const provider = new providers.JsonRpcProvider(RPC_URL, { chainId: CHAIN_ID });

async function buildAndSign(subscriptionId) {
  const wallet = new Wallet(EXECUTOR_PRIVATE_KEY, provider);

  // Abi encode executePayment(uint256)
  const iface = new utils.Interface(["function executePayment(uint256)"]);
  const data = iface.encodeFunctionData("executePayment", [BigInt(subscriptionId)]);

  // Fetch nonce
  const nonce = await provider.getTransactionCount(wallet.address);

  // Fee estimates — adapt if provider doesn't return EIP-1559 fields
  const feeData = await provider.getFeeData();
  // set defaults if undefined
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? utils.parseUnits("1", "gwei");
  const maxFeePerGas = feeData.maxFeePerGas ?? utils.parseUnits("60", "gwei");

  const tx = {
    to: CONTRACT_ADDRESS,
    data,
    value: 0,
    nonce,
    chainId: CHAIN_ID,
    type: 2, // EIP-1559
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit: 200000n,
  };

  // Sign transaction -> returns signed RLP hex
  const signed = await wallet.signTransaction(tx); // "0x..."
  const signedHex = signed.startsWith("0x") ? signed : `0x${signed}`;
  const rlpBytes = hexToBytes(signedHex); // returns Uint8Array

  // coinbaseBytes: 20 byte array — usually zeros are fine for testnets
  const coinbaseBytes = new Uint8Array(20);

  return {
    signedHex,
    rlpBytes, // Uint8Array
    coinbaseBytes,
    signer: wallet.address,
    nonce,
  };
}

// CLI usage
if (require.main === module) {
  const id = process.argv[2];
  if (!id) {
    console.error("usage: node agent-sign-tx.js <subscriptionId>");
    process.exit(1);
  }
  buildAndSign(id).then((res) => {
    console.log("Signed Hex:", res.signedHex);
    console.log("rlpBytes length:", res.rlpBytes.length);
    // If you need JSON to return to workflow, we can encode base64
    console.log("rlpBase64:", Buffer.from(res.rlpBytes).toString("base64"));
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

export { buildAndSign };
