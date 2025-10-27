import { expect } from "chai";
import { ethers } from "hardhat";

describe("SubFlow (native token) — Ethers v6 Tests", function () {
  let subFlow;
  let deployer, subscriber, recipient, executor;
  const amount = ethers.parseEther("0.1");
  const frequency = 60n; // 60 seconds

  beforeEach(async function () {
    [deployer, subscriber, recipient, executor] = await ethers.getSigners();

    const SubFlow = await ethers.getContractFactory("SubFlow");
    subFlow = await SubFlow.deploy();
    await subFlow.waitForDeployment();

    await (await subFlow.addExecutor(executor.address)).wait();
  });

  it("should create a subscription correctly", async function () {
    const tx = await subFlow
      .connect(subscriber)
      .createSubscription(recipient.address, amount, frequency, {
        value: amount * 2n,
      });

    const receipt = await tx.wait();
    const event = receipt.logs
      .map((l) => subFlow.interface.parseLog(l))
      .find((e) => e.name === "SubscriptionCreated");

    const id = event.args.id;

    const s = await subFlow.getSubscription(id);
    expect(s.subscriber).to.equal(subscriber.address);
    expect(s.recipient).to.equal(recipient.address);
    expect(s.amount).to.equal(amount);
    expect(s.balance).to.equal(amount * 2n);
  });

  it("executor executes payment correctly", async function () {
    const tx = await subFlow
      .connect(subscriber)
      .createSubscription(recipient.address, amount, frequency, {
        value: amount * 2n,
      });

    const receipt = await tx.wait();
    const event = receipt.logs
      .map((l) => subFlow.interface.parseLog(l))
      .find((e) => e.name === "SubscriptionCreated");
    const id = event.args.id;

    // increase time
    await ethers.provider.send("evm_increaseTime", [Number(frequency) + 1]);
    await ethers.provider.send("evm_mine");

    const balBefore = await ethers.provider.getBalance(recipient.address);
    await (await subFlow.connect(executor).executePayment(id)).wait();
    const balAfter = await ethers.provider.getBalance(recipient.address);

    expect(balAfter - balBefore).to.equal(amount);

    const s = await subFlow.getSubscription(id);
    expect(s.balance).to.equal(amount);
  });

  it("subscriber can top up and cancel", async function () {
    const tx = await subFlow
      .connect(subscriber)
      .createSubscription(recipient.address, amount, frequency, { value: amount });
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((l) => subFlow.interface.parseLog(l))
      .find((e) => e.name === "SubscriptionCreated");
    const id = event.args.id;

    await (
      await subFlow.connect(subscriber).topUp(id, { value: amount * 3n })
    ).wait();

    let s = await subFlow.getSubscription(id);
    expect(s.balance).to.equal(amount * 4n);

    const cancelTx = await subFlow.connect(subscriber).cancelSubscription(id);
    const cancelReceipt = await cancelTx.wait();

    const cancelEvent = cancelReceipt.logs
      .map((l) => subFlow.interface.parseLog(l))
      .find((e) => e.name === "SubscriptionCancelled");

    expect(cancelEvent.args.refundAmount).to.equal(amount * 4n);
  });
});
