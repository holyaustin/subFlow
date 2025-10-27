// cadence/scripts/get_subscription.cdc
pub fun main(id: UInt64): &SubFlow.Subscription {
    let creator = getAccount(0x01).getCapability<&SubFlow.CreatorAdmin>(/public/SubFlowCreatorAdmin).borrow()!
    return creator.subscriptions[id]!
}