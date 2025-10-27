import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79


access(all) contract SubFlow {

    access(all) event SubscriptionCreated(id: UInt64, creator: Address, subscriber: Address, amount: UFix64, nextChargeDate: UFix64)
    access(all) event SubscriptionProcessed(id: UInt64, creator: Address, subscriber: Address, amount: UFix64, nextChargeDate: UFix64)
    access(all) event SubscriptionTerminated(id: UInt64)

    access(all) resource Subscription {
        access(all) let id: UInt64
        access(all) let creator: Address
        access(all) let subscriber: Address
        access(all) let amount: UFix64
        access(all) let interval: UFix64
        access(all) var nextChargeDate: UFix64

        init(_id: UInt64, _creator: Address, _subscriber: Address, _amount: UFix64, _interval: UFix64) {
            self.id = _id
            self.creator = _creator
            self.subscriber = _subscriber
            self.amount = _amount
            self.interval = _interval
            self.nextChargeDate = UFix64(getCurrentBlock().timestamp) + _interval
        }
    }

    access(all) resource CreatorAdmin {
        access(all) var nextId: UInt64
        access(all) var subscriptionIDs: [UInt64]

        init() {
            self.nextId = 0
            self.subscriptionIDs = []
        }

        // Create a subscription and return it to the caller
        access(all) fun createSubscription(subscriber: Address, amount: UFix64, interval: UFix64): @Subscription {
            let id = self.nextId
            self.nextId = self.nextId + 1

            let newSubscription <- create Subscription(
                _id: id,
                _creator: self.owner?.address ?? panic("CreatorAdmin has no owner address"),
                _subscriber: subscriber,
                _amount: amount,
                _interval: interval
            )

            self.subscriptionIDs.append(id)

            emit SubscriptionCreated(
                id: id,
                creator: self.owner?.address ?? panic("CreatorAdmin has no owner address"),
                subscriber: subscriber,
                amount: amount,
                nextChargeDate: newSubscription.nextChargeDate
            )
            return <- newSubscription
        }

        // Store a subscription resource in the account's storage
        access(all) fun storeSubscription(account: auth(Storage) &Account, subscription: @Subscription) {
            let path = /storage/Subscription_<-subscription.id
            account.storage.save(<-subscription, to: path)
        }

        // Process a charge for a subscription by ID
        access(all) fun processCharge(account: &Account, subscriptionId: UInt64) {
            let path = /storage/Subscription_<-subscriptionId
            let subscriptionRef = account.storage.borrow<&Subscription>(from: path)
                ?? panic("Subscription not found in storage")

            let currentTime = UFix64(getCurrentBlock().timestamp)

            if currentTime >= subscriptionRef.nextChargeDate {
                let subscriberAcct = getAccount(subscriptionRef.subscriber)
                let vaultRef = subscriberAcct
                    .getCapability(/public/flowTokenVault)!
                    .borrow<&FlowToken.Vault & FungibleToken.Provider>()
                    ?? panic("Could not borrow subscriber's vault")

                if vaultRef.balance < subscriptionRef.amount {
                    panic("Subscriber does not have enough funds for the charge")
                }

                let paymentVault <- vaultRef.withdraw(amount: subscriptionRef.amount)

                let creatorAcct = getAccount(subscriptionRef.creator)
                let creatorVault = creatorAcct
                    .getCapability(/public/flowTokenVault)!
                    .borrow<&FlowToken.Vault & FungibleToken.Receiver>()
                    ?? panic("Could not borrow creator's vault")

                creatorVault.deposit(from: <-paymentVault)

                subscriptionRef.nextChargeDate = subscriptionRef.nextChargeDate + subscriptionRef.interval

                emit SubscriptionProcessed(
                    id: subscriptionRef.id,
                    creator: subscriptionRef.creator,
                    subscriber: subscriptionRef.subscriber,
                    amount: subscriptionRef.amount,
                    nextChargeDate: subscriptionRef.nextChargeDate
                )
            }
        }

        // Terminate a subscription by ID
        access(all) fun terminateSubscription(account: auth(Storage) &Account, subscriptionId: UInt64) {
            let path = /storage/Subscription_<-subscriptionId
            let subscription <- account.storage.load<@Subscription>(from: path)
                ?? panic("Subscription not found in storage")
            destroy subscription

            // Remove the ID from the list
            let index = self.subscriptionIDs.indexOf(subscriptionId)
            if index != nil {
                self.subscriptionIDs.remove(at: index!)
            }

            emit SubscriptionTerminated(id: subscriptionId)
        }
    }

    // Setup function for creators
    access(all) fun setupCreator(account: auth(Storage) &Account) {
        if account.storage.borrow<&CreatorAdmin>(from: /storage/SubFlowCreatorAdmin) == nil {
            account.storage.save(<- create CreatorAdmin(), to: /storage/SubFlowCreatorAdmin)
            account.link<&SubFlow.CreatorAdmin>(/public/SubFlowCreatorAdmin, target: /storage/SubFlowCreatorAdmin)
        }
    }

    access(all) fun getCreatorAdmin(creator: Address): &CreatorAdmin? {
        return getAccount(creator)
            .getCapability<&SubFlow.CreatorAdmin>(/public/SubFlowCreatorAdmin)
            .borrow()
    }
}
