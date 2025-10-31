// app/api/sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import SubFlowArtifact from "@/lib/SubFlow.json";

const PRIVATE_KEY = process.env.EXECUTOR_PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.SUBFLOW_CONTRACT!;
const AGENT_SECRET = process.env.AGENT_SECRET!;

//console.log("ABI is : ", (SubFlowArtifact as any)?.abi || (SubFlowArtifact as any)?.default?.abi);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, subscriptionId } = body;

    if (secret !== AGENT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!subscriptionId) {
      return NextResponse.json({ error: "Missing subscriptionId" }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider("https://testnet.evm.nodes.onflow.org");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Load ABI
    const abi = (SubFlowArtifact as any)?.abi || (SubFlowArtifact as any)?.default?.abi;
    if (!abi) throw new Error("ABI missing in SubFlow.json");

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    // ✅ Confirm the function exists in ABI before calling
    const iface = new ethers.Interface(abi);
    if (!iface.getFunction("executePayment")) {
      throw new Error("executePayment() not found in ABI");
    }

    // ✅ Build unsigned transaction manually via encodeFunctionData
    const calldata = iface.encodeFunctionData("executePayment", [BigInt(subscriptionId)]);
    const nonce = await provider.getTransactionCount(wallet.address);
    const network = await provider.getNetwork();

    const tx = {
      to: CONTRACT_ADDRESS,
      data: calldata,
      nonce,
      chainId: Number(network.chainId),
      gasLimit: 300000n,
    };

    // ✅ Sign but don’t send
    const signedTx = await wallet.signTransaction(tx);
    const rawBytes = ethers.getBytes(signedTx);
    const base64 = Buffer.from(rawBytes).toString("base64");

    return NextResponse.json({
      rlpBase64: base64,
      signedHex: signedTx,
      from: wallet.address,
      nonce,
    });
  } catch (err: any) {
    console.error("❌ Signing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
