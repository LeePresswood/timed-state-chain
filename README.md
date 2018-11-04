# timed-state-chain
#### An unnecessary debugging library for Javascript.

## Description
`timed-state-chain` is a library that allows you to watch how a variable changes over time. A blockchain was uselessly implemented to achieve this goal for two reasons:

    1. To mimic the needless implementation of blockchain technologies in the contemporary startup, and
    2. To provide an over-secure tool for testing.

## Usage
Importing and instantiating the `Block` class:
```javascript
var Block = require('timed-state-chain').Block;

var var1 = new Block({abc: 123});
```

Getting the current state:
```javascript
console.log(var1.getState()); // { abc: 123 }
console.log(var1.getStateOf('abc')); // 123
```

Mutating the state:
```javascript
var1.push({abc: 111});
console.log(var1.getStateOf('abc')); // 111
console.log(var1.getStateOf('differentKey')); // undefined

var1.push({differentKey: 'Different value!'});
console.log(var1.getStateOf('abc')); // 111
console.log(var1.getStateOf('differentKey')); // 'Different value!'
```

Validating the chain:
```javascript
var1.state.abc = 'Tampering with the data!';
console.log(var1.isValid()); // false
```

## Methods
The `Block` class provides a number of methods to interface with the state as it transitions over time.
|Method|Arguments|Description|
|---|---|---|
|calculateHash()|-|Get the current SHA256-encoded hash of the requested block. If called from the top of the blockchain, gets the hash of the genesis block. Used internally to validate the chain.|
|push()|**nextState**: The next state that should be stored on the blockchain|Pushes the passed state onto the blockchain. Can be any data type, but note that methods like `getStateOf()` expect the `state` to be of type `object`.|
|isValid()|-|Returns `true` if the chain is valid and `false` otherwise. Recursively checks the current hash against the calculated hash for the current block, the previous block, and all blocks down the chain.|