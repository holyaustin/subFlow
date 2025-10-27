// cadence/tests/SubFlow_test.cdc
import SubFlow from 0x01

pub fun testSetupCreator(): Bool {
    let creator <- getAccount(0x01).borrow<&SubFlow.CreatorAdmin>(from: /public/SubFlowCreatorAdmin)
    return creator != nil
}

pub fun testCreateSubscription(): Bool {
    let creator <- getAccount(0x01).borrow<&SubFlow.CreatorAdmin>(from: /public/SubFlowCreatorAdmin)
    let subscription <- creator.createSubscription(subscriber: getAccount(0x02), amount: 10.0, interval: 86400.0)
    return subscription != nil
}

pub fun testProcessCharge(): Bool {
    // Setup
    let creator <- getAccount(0x01).borrow<&SubFlow.CreatorAdmin>(from: /public/SubFlowCreatorAdmin)
    let subscription <- creator.createSubscription(subscriber: getAccount(0x02), amount: 10.0, interval: 86400.0)

    // Process charge
    creator.processCharge(subscription.id)

    // Check next charge date updated
    let updatedSubscription <- creator.subscriptions[subscription.id]
    return updatedSubscription.nextChargeDate != subscription.nextChargeDate
}