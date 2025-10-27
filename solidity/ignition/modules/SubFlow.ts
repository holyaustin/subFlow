// ignition/modules/SubFlow.js
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubFlowModule = buildModule("SubFlowModule", (m) => {
  // Deploy the SubFlow contract (constructor takes no args)
  const subFlow = m.contract("SubFlow");

  // Optional: run a post-deployment action (e.g., set executor)
  const deployer = m.getAccount(0);
  m.call(subFlow, "addExecutor", [deployer]);

  return { subFlow };
});

export default SubFlowModule;
