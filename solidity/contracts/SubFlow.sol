// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title SubFlow - native-token subscription manager for Flow EVM
/// @author Austin / subFlow Team
/// @notice Subscribers pre-fund subscription balances (native token). Authorized executors or subscriber can call executePayment() which pays recipient from contract-held balance.
/// @dev No-arg constructor. Use addExecutor(...) to add Forte workflow agent or relayer address.

contract SubFlow {
    /* ========== ERRORS ========== */
    error ZeroAddress();
    error InvalidAmount();
    error InvalidFrequency();
    error NotActive();
    error NotSubscriberOrExecutor();
    error SubscriptionNotFound();
    error NotSubscriber();
    error AlreadyPaused();
    error AlreadyUnpaused();
    error InsufficientBalance();
    error TransferFailed();

    /* ========== EVENTS ========== */
    event SubscriptionCreated(
        uint256 indexed id,
        address indexed subscriber,
        address indexed recipient,
        uint256 amount,
        uint256 frequency,
        uint256 nextPayment,
        uint256 balance
    );
    event PaymentExecuted(uint256 indexed id, address indexed executor, uint256 amount, uint256 timestamp);
    event SubscriptionCancelled(uint256 indexed id, address indexed canceller, uint256 refundAmount, uint256 timestamp);
    event ExecutorAdded(address indexed executor);
    event ExecutorRemoved(address indexed executor);
    event OwnerTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event Rescue(address indexed to, uint256 amount);

    /* ========== STORAGE ========== */
    struct Subscription {
        address subscriber;
        address recipient;
        uint256 amount;       // amount to pay each period (in wei)
        uint256 frequency;    // seconds between payments
        uint256 nextPayment;  // next payment timestamp
        uint256 balance;      // prepaid balance (in wei)
        bool active;
    }

    address public owner;
    bool public paused;
    uint256 private _nextId;
    mapping(uint256 => Subscription) private _subscriptions;
    mapping(address => bool) public isExecutor;

    /* ========== MODIFIERS ========== */
    modifier onlyOwner() {
        require(msg.sender == owner, "SubFlow: not owner");
        _;
    }

    modifier notPaused() {
        require(!paused, "SubFlow: paused");
        _;
    }

    /* ========== CONSTRUCTOR ========== */
    constructor() {
        owner = msg.sender;
        _nextId = 1;
    }

    /* ========== OWNER / ADMIN ========== */

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "SubFlow: zero owner");
        address prev = owner;
        owner = newOwner;
        emit OwnerTransferred(prev, newOwner);
    }

    function addExecutor(address executor) external onlyOwner {
        require(executor != address(0), "SubFlow: zero executor");
        if (!isExecutor[executor]) {
            isExecutor[executor] = true;
            emit ExecutorAdded(executor);
        }
    }

    function removeExecutor(address executor) external onlyOwner {
        if (isExecutor[executor]) {
            isExecutor[executor] = false;
            emit ExecutorRemoved(executor);
        }
    }

    function pause() external onlyOwner {
        require(!paused, "SubFlow: already paused");
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        require(paused, "SubFlow: not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }

    /// rescue native balance accidentally stuck (only owner)
    function rescueNative(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "SubFlow: zero address");
        (bool ok,) = to.call{value: amount}("");
        require(ok, "SubFlow: rescue transfer failed");
        emit Rescue(to, amount);
    }

    /* ========== SUBSCRIPTION LOGIC (native token) ========== */

    /// @notice Create a subscription and optionally pre-fund it by sending native value
    /// @param recipient address to receive recurring payments
    /// @param amount recurring payment amount (wei)
    /// @param frequency interval in seconds (minimum enforced)
    /// @return id subscription id
    function createSubscription(address recipient, uint256 amount, uint256 frequency) external payable notPaused returns (uint256) {
        require(recipient != address(0), "SubFlow: zero recipient");
        require(amount > 0, "SubFlow: amount zero");
        require(frequency >= 60, "SubFlow: frequency too small"); // enforce min 1 minute

        uint256 id = _nextId++;
        uint256 next = block.timestamp + frequency;
        uint256 initialBalance = msg.value; // subscriber may top up at creation

        _subscriptions[id] = Subscription({
            subscriber: msg.sender,
            recipient: recipient,
            amount: amount,
            frequency: frequency,
            nextPayment: next,
            balance: initialBalance,
            active: true
        });

        emit SubscriptionCreated(id, msg.sender, recipient, amount, frequency, next, initialBalance);
        return id;
    }

    /// @notice Top up prepaid balance for a subscription (payable)
    function topUp(uint256 id) external payable notPaused {
        Subscription storage s = _subscriptions[id];
        require(s.subscriber != address(0), "SubFlow: not found");
        require(s.active, "SubFlow: not active");
        require(msg.value > 0, "SubFlow: zero topup");
        require(msg.sender == s.subscriber, "SubFlow: only subscriber");

        s.balance += msg.value;
        // emit small event via SubscriptionCreated? We'll use PaymentExecuted for payment events; topup left implicit to save gas.
        // For better indexing emit a TopUp event if needed.
    }

    /// @notice Cancel subscription and refund remaining prepaid balance to subscriber
    function cancelSubscription(uint256 id) external notPaused {
        Subscription storage s = _subscriptions[id];
        require(s.subscriber != address(0), "SubFlow: not found");
        require(s.active, "SubFlow: not active");
        require(msg.sender == s.subscriber || msg.sender == owner, "SubFlow: not allowed");

        s.active = false;
        uint256 refund = s.balance;
        s.balance = 0;

        if (refund > 0) {
            (bool ok,) = payable(s.subscriber).call{value: refund}("");
            require(ok, "SubFlow: refund failed");
        }

        emit SubscriptionCancelled(id, msg.sender, refund, block.timestamp);
    }

    /// @notice Execute payment for a subscription (can be called by subscriber, owner, or authorized executor)
    /// @dev Contract must hold prepaid balance >= amount for this subscription
    function executePayment(uint256 id) external notPaused {
        Subscription storage s = _subscriptions[id];
        require(s.subscriber != address(0), "SubFlow: not found");
        require(s.active, "SubFlow: not active");
        require(block.timestamp >= s.nextPayment, "SubFlow: too early");

        // only authorized
        bool authorized = (msg.sender == s.subscriber) || (msg.sender == owner) || isExecutor[msg.sender];
        require(authorized, "SubFlow: not authorized");

        if (s.balance < s.amount) revert InsufficientBalance(); // custom revert message via error
        // transfer native to recipient
        s.balance -= s.amount;
        (bool ok,) = payable(s.recipient).call{value: s.amount}("");
        if (!ok) revert TransferFailed();

        // update nextPayment (avoid loops by setting to now + frequency)
        s.nextPayment = block.timestamp + s.frequency;

        emit PaymentExecuted(id, msg.sender, s.amount, block.timestamp);
    }

    /* ========== VIEW HELPERS ========== */

    /// Get subscription summary
    function getSubscription(uint256 id) external view returns (
        address subscriber,
        address recipient,
        uint256 amount,
        uint256 frequency,
        uint256 nextPayment,
        uint256 balance,
        bool active
    ) {
        Subscription storage s = _subscriptions[id];
        require(s.subscriber != address(0), "SubFlow: not found");
        return (s.subscriber, s.recipient, s.amount, s.frequency, s.nextPayment, s.balance, s.active);
    }

    /// Next id (for off-chain indexing)
    function nextId() external view returns (uint256) {
        return _nextId;
    }

    /* ========== FALLBACK RECEIVER ========== */

    // Allow contract to receive native tokens unexpectedly
    receive() external payable { }
    fallback() external payable { }
}
