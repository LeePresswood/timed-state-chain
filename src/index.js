const {
    SHA256
} = require("crypto-js");

class Block {
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
        let calculatedHash = "";
        this.nonce = 0;
        do {
            this.nonce++;
            calculatedHash = this.calculateHash();
        }
        while (!calculatedHash.startsWith("0"));
        return calculatedHash;
    }
};

module.exports.isChainValid = isChainValid;

function isChainValid(block) {
    //Empty/End of chain.
    if (!block) {
        return true;
    }

    //Genesis block.
    if (block.index === 0 &&
        block.previous === null &&
        block.previousHash === null &&
        block.calculateHash() === block.hash) {
        return true && isChainValid(block.next);
    }

    //Tampered current block.
    if (block.calculateHash() !== block.hash) {
        return false;
    }

    //Tampered previous block.
    if (block.previous && block.previous.calculateHash() !== block.previous.hash) {
        return false;
    }

    //Tampered previous hash.
    if (block.previous && block.previous.calculateHash() !== block.previousHash) {
        return false;
    }

    return true && isChainValid(block.next);
}



/**
 * Get genesis block of blockchain using the given state.
 *
 * "state" should be key-value map representing the state of an object
 * at a given time.
 */
module.exports.startChain = (state) => new Block(state);

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
module.exports.addToChain = (state, chain, index = 1) => {
    if (chain.next === null) {
        chain.next = new Block(state, index, chain);
        return;
    }
    this.addToChain(state, chain.next, index + 1);
};