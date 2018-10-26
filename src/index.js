const {
    SHA256
} = require("crypto-js");

module.exports.Block = class {
    constructor(index, state = {}, timestamp = Date.now(), previousHash = null) {
        this.index = index;
        this.state = state;
        this.timestamp = timestamp;
        this.previousHash = previousHash;

        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256().toString();
    }
};

module.exports.getGenesisBlock = (state) => {
    return new Block(0, state)
};