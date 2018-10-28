const {
    SHA256
} = require("crypto-js");

module.exports.Block = class {
    constructor(index, state = {}, timestamp = Date.now(), previousHash = null) {
        this.index = index;
        this.state = state;
        this.timestamp = timestamp;
        this.previousHash = previousHash;

        this.previous = null;
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

    addNewBlock(block) {
        //Only add to end of chain.
        if (this.next !== null) {
            this.next = this.next.addNewBlock(block);
        }

        //Only add valid block to a valid chain.
        if (isChainValid(this) && isChainValid(block)) {
            //Current block points to new block and recalculate hash.
            this.next = block;
            this.hash = this.calculateHash();

            //New block points to previous block and calculates its hash.
            block.previous = this;
            block.previousHash = this.hash;
            block.next = null;
            block.hash = block.calculateHash();
        }

        return this;
    }

    static mineNewBlock(block) {
        if (!block || block instanceof Block === false) {
            return null;
        }

        do {
            block.nonce++;
            block.hash = block.calculateHash();
        }
        while (block.hash.startsWith("000"));
    }

    static getGenesisBlock(state) {
        return new this(0, state);
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