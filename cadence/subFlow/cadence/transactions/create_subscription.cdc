// cadence/transactions/create_subscription.cdc
import SubFlow from 0x01

transaction(amount: UFix64, interval: UFix64) {
    let creator: &SubFlow.CreatorAdmin

    prepare(acct: AuthAccount) {
        self.creator = acct.borrow<&SubFlow.CreatorAdmin>(from: /storage/SubFlowCreatorAdmin)!!
    }

    execute {
        let newSubscription <- self.creator.createSubscription(subscriber: getAccount(0x02), amount: amount, interval: interval)
        log("Subscription created with ID: ${newSubscription}")
    }
}