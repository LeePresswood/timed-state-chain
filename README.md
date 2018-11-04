# timed-state-chain
#### An unnecessary debugging library for Javascript.

## Description
`timed-state-chain` is a library that allows you to watch how a variable changes over time. A blockchain was uselessly implemented to achieve this goal for two reasons:

    1. To mimic the needless implementation of blockchain technologies in the contemporary startup, and
    2. To provide an over-secure tool for testing.

## Usage
```javascript
var Block = require('timed-state-chain').Block;

var var1 = new Block({abc: 123});
var1.push({abc: 111});

console.log(var1.getStateOf('abc')); // 111
```

