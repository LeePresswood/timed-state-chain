# timed-state-chain
#### An unnecessary debugging library for Javascript.

[![Build Status](https://travis-ci.com/LeePresswood/timed-state-chain.svg?branch=master)](https://travis-ci.com/LeePresswood/timed-state-chain)

## Description
`timed-state-chain` is a library that allows you to watch how a variable changes over time. We've used a simple blockchain algorithm to ensure a secure, maintained state with the option for lookback over time.

## Usage
Importing and instantiating the `Block` class:
```javascript
var Block = require('timed-state-chain').Block;

var blockchain = new Block({abc: 123});
```

Getting the current state:
```javascript
console.log(blockchain.getCurrentState()); // { abc: 123 }
console.log(blockchain.getCurrentStateOf('abc')); // 123
console.log(blockchain.getCurrentStateOf('differentKey')); // undefined
```

Mutating the state:
```javascript
//Pushing a state with a new key does not change the old key's value.
blockchain.push({differentKey: 'Different value!'});
console.log(blockchain.getCurrentStateOf('abc')); // 123
console.log(blockchain.getCurrentStateOf('differentKey')); // 'Different value!'

//Pushing a new value for the old key changes the value.
blockchain.push({abc: 111});
console.log(blockchain.getCurrentStateOf('abc')); // 111
console.log(blockchain.getCurrentStateOf('differentKey')); // 'Different value!'
console.log(blockchain.getCurrentStateOf('thirdKey')); // undefined
```

Validating the chain:
```javascript
//Unchanged chains are valid.
console.log(blockchain.isValid()); // true

//Changing the state of any segment of the chain invalidates it.
blockchain.getCurrentState().abc = 'Tampering with the data!';
console.log(blockchain.isValid()); // false
```

## Methods
The `Block` class provides a number of methods to interface with the state as it transitions over time.

| Method | Arguments | Description |
| --- | --- | --- |
| `calculateHash()` | - | Get the current SHA256-encoded hash of the requested block. If called from the top of the blockchain, gets the hash of the genesis block. Used internally to validate the chain. |
| `push(nextState)` | **nextState**: The next state to store on the blockchain. | Pushes the passed state onto the blockchain. Can be any data type, but note that methods like `getCurrentStateOf()` expect the `state` to be of type `object`.|
| `isValid()` | - | Returns `true` if the chain is valid and `false` otherwise. Recursively checks the current hash against the calculated hash for the current block, the previous block, and all blocks down the chain. |
| `getCurrentState()` | - | Returns the latest state in the chain. |
| `getStateArray()` | - | Returns each state in the chain. Index 0 is the earliest state in the blockchain, and later indices are later additions to the chain. |
| `getCurrentStateOf(key)` | **key**: The key to use when searching the states on the chain. | Returns the value associated with the most recent usage of the **key** parameter. Note that this does *not* look at the most recently pushed state for the key. Rather, it looks at the most recently pushed state that *includes* this key. |
| `getStateArrayOf(key)` | **key**: The key to use when searching the states on the chain. | Returns the value associated with *each* usage of the **key** parameter. Note that this does *not* look at the most recently pushed state for the key. Rather, it looks at the most recently pushed state that *includes* this key. |