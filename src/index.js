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

    static isChainValid(block) {
        //Genesis block check.
        if (block && block.index === 0 && block.calculateHash() === block.hash) {
            return true;
        }

        //Empty/End of chain.
        if (!block) {
            return true;
        }

        //Stray block.
        if (!block.previous) {
            return false;
        }

        //Tampered previous block.
        if (block.previous.calculateHash() !== block.previous.hash) {
            return false;
        }

        //Tampered previous hash.
        if (block.previous.calculateHash() !== block.previousHash) {
            return false;
        }

        //Tampered current block.
        if (block.calculateHash() !== block.hash) {
            return false;
        }

        return true && Block.isChainValid(block.next);
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

    addNewBlock(block) {

    }

    static getGenesisBlock(state) {
        return new this(0, state);
    }
};

// var blockchain = [
//     getGenesisBlock()
// ];