const {
    startChain,
    addToChain,
} = require('../src/index');

describe("startChain", () => {
    test("returns type of Block", () => {
        const block = startChain({
            abc: 123
        });

        expect(block).toHaveProperty("state");
        expect(block).toHaveProperty("index");
        expect(block).toHaveProperty("timestamp");
        expect(block).toHaveProperty("previousHash");
        expect(block).toHaveProperty("previous");
        expect(block).toHaveProperty("next");
        expect(block).toHaveProperty("nonce");
        expect(block).toHaveProperty("hash");
    });
});

describe("addToChain", () => {
    test("returns type of Block", () => {
        let block = startChain({
            abc: 123
        });
        block = addToChain({
            aaa: 321
        }, block);

        expect(block).toHaveProperty("state");
        expect(block).toHaveProperty("index");
        expect(block).toHaveProperty("timestamp");
        expect(block).toHaveProperty("previousHash");
        expect(block).toHaveProperty("previous");
        expect(block).toHaveProperty("next");
        expect(block).toHaveProperty("nonce");
        expect(block).toHaveProperty("hash");
    });
});