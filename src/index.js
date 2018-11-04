const {
    SHA256
} = require("crypto-js");

module.exports.Block = class Block {

    /**
     * Get genesis block of blockchain using the given state.
     *
     * "state" should be key-value map representing the state of an object
     * at a given time.
     */
    constructor(state, index = 0, previous = null) {
        this.state = state;
        this.index = index;
        this.previous = previous;

        this.previousHash = previous && previous.calculateHash() || null;
        this.timestamp = Date.now();
        this.next = null;
        this.hash = this.mineNewBlock();
    }

    calculateHash() {
        return SHA256(
            this.index +
            JSON.stringify(this.state) +
            this.timestamp +
            this.previousHash +
            this.nonce
        ).toString();
    }

    mineNewBlock() {
        //You should only be allowed to mine a block once.
        //To protect, let's just return the current hash if it's not null.
        if (this.hash) {
            return this.hash;
        }

        let calculatedHash = "";
        this.nonce = 0;
        do {
            this.nonce++;
            calculatedHash = this.calculateHash();
        }
        while (!calculatedHash.startsWith("0"));
        return calculatedHash;
    }

    /**
     * Validate the passed chain.
     *
     * To be considered valid, the head of the chain must have a hash that
     * matches calculated hash of the current block state. On top of that,
     * every subsequent block in the chain must meet this same standard
     * while also having a non-zero index, a previous block reference,
     * and a previousHash that matches the calculation of the previous
     * block's hash at the current state of the block.
     *
     * Empty chains are assumed to be empty to allow for recursive checking.
     */
    isValid() {
        //Unmined hash.
        if (!this.hash || this.hash.startsWith("0") === false) {
            return false;
        }

        //Tampered current block.
        if (this.hash !== this.calculateHash()) {
            return false;
        }

        //Tampered index / Missing backward connection data.
        if (this.index !== 0 && (!this.previous || !this.previousHash)) {
            return false;
        }

        //Tampered previous hash.
        if (this.previous && this.previousHash !== this.previous.calculateHash()) {
            return false;
        }

        //End of chain.
        if (this.next === null) {
            return true;
        }

        //Not end of chain. Check validity of next block.
        return true && this.next.isValid();
    }

    /**
     * Add the passed state to the passed chain. Blocks are added to the
     * end of the chain, and the genesis block is returned.
     *
     * "state" should be key - value map representing the state of an object
     * at a given time.
     *
     * "chain" should be an already-started blockchain. (Hint: Use startChain()
     * to start a new chain.)
     */
    push(state, index = 1) {
        if (this.next === null) {
            this.next = new Block(state, index, this);
            return;
        }
        this.next.push(state, index + 1);
    }
};