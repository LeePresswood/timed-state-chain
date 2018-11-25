const {
    SHA256
} = require("crypto-js");

module.exports.Block = class Block {

    /**
     * Get genesis block of blockchain using the given state.
     *
     * @param {object} states  The key-value map representing the state of an object
     * at a given time.
     */
    constructor(state, index = 0, previous = null) {
        //We're expecting the `state` parameter to be an object.
        //Note that this includes null. No reason to block those off. Ultimately,
        //Usage of the chain will stay the same.
        if (typeof state === 'object') {
            this.state = state;
            this.index = index;
            this.previous = previous;

            this.previousHash = previous && previous.calculateHash() || null;
            this.timestamp = Date.now();
            this.next = null;
            this.hash = this.mineNewBlock();

            //Set the error flag on this object if the error flag on the previous object is set.

            this.errorFlag = previous && previous.errorFlag || false;
        } else {
            console.error("Error flag set. Invalid state passed to constructor.");
            console.error("Try using a key-value object map.");
            this.errorFlag = true;
        }
    }

    /**
     * @returns The SHA256-encoded string of the block's various data points.
     */
    calculateHash() {
        return SHA256(
            this.index +
            JSON.stringify(this.state) +
            this.timestamp +
            this.previousHash +
            this.nonce
        ).toString();
    }

    /**
     * If a hash is not set, follow proof-of-work algorithm to find the hash. If a hash is set,
     * simply return the hash.
     *
     * @returns A mined hash showing proof-of-work.
     */
    mineNewBlock() {
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
     * Add the passed state to the passed chain. Blocks are added to the
     * end of the chain, and the genesis block is returned.
     *
     * @param {*} state State to store on the chain. Can be any type, but works
     *                  correctly with the library if key-value map.
     * @param {number} index Optional starting index for the next state. Used
     *                       recursively (+1 each call) as we go down the chain.
     */
    push(state, index = 1) {
        if (this.errorFlag) {
            console.error("Can't push. Reason: Invalid blockchain due to invalid state.");
            return this;
        } else if (typeof state !== "object") {
            console.error("Error flag set. Invalid state passed to constructor.");
            console.error("Try using a key-value object map.");
            this.errorFlag = true;
            return this;
        }

        if (this.next === null) {
            this.next = new Block(state, index, this);
        } else {
            this.next.push(state, index + 1);
        }
        return this;
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

        //End of chain. Check if error flag set for extra validity.
        if (this.next === null) {
            return !this.errorFlag && true;
        }

        //Not end of chain. Check validity of next block.
        return true && this.next.isValid();
    }

    /**
     * @returns The latest state in the chain.
     */
    getCurrentState(stateArray = []) {
        return this.getStateArray().pop();
    }

    /**
     * @returns Array of states associated with the blockchain. The start of the array is
     * the first state in the chain. Looking deeper into the array will give newer state
     * transitions until -- ultimately -- reaching the current state in the last index of
     * the array.
     */
    getStateArray(stateArray = []) {
        stateArray.push(this.state);

        return this.next ?
            this.next.getStateArray(stateArray) :
            stateArray;
    }

    /**
     * Assuming a `state` of a key-value map, get the current value of the passed key.
     *
     * @param {String} key The value to search for.
     *
     * @returns The most recent value associated with that key.
     */
    getCurrentStateOf(key) {
        const stateArray = this.getStateArrayOf(key);
        return stateArray.length > 0 ?
            stateArray.pop() :
            null;
    }

    /**
     * Assuming a `state` of a key-value map, get each value associated of the passed key.
     *
     * @param {String} key The value to search for.
     *
     * @returns Array of states associated with the given key. The start of the array is
     * the first known instance of that key in the chain. Looking deeper into the array
     * will give newer state transitions until -- ultimately -- reaching the current state in the
     * last index of the array.
     */
    getStateArrayOf(key, stateArray = []) {
        if (this.state.hasOwnProperty(key)) {
            stateArray.push(this.state[key]);
        }

        return this.next ?
            this.next.getStateArrayOf(key, stateArray) :
            stateArray;
    }
};