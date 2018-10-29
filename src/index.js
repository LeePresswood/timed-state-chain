const {
    SHA256
} = require("crypto-js");

class Block {
    constructor(state, index = 0, previous = null, previousHash = null) {
        this.state = state;
        this.index = index;
        this.previousHash = previousHash;
        this.previous = null;

        this.timestamp = Date.now();
        this.next = null;
        this.nonce = 0;

        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.index +
            this.state +
            this.timestamp +
            this.previousHash +
            this.nonce
        ).toString();
    }

    addNewBlock(state, index = 0) {
        //Only add to end of chain.
        if (this.next !== null) {
            this.next = this.next.addNewBlock(block);
        }

        //New block points to previous block.
        let block = new Block(state, index);
        block.previous = this;
        block.previousHash = this.hash;
        block.next = null;

        //Current block points to new block.
        this.next = block.mineNewBlock();

        return this;
    }

    mineNewBlock() {
        this.nonce = 0;
        do {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        while (!this.hash.startsWith("0"));

        return this;
    }

    static getGenesisBlock(state) {
        return new this(0, state).mineNewBlock();
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
module.exports.addToChain = (state, chain) => chain.addNewBlock(state);