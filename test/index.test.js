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
        expect(block.next).toBeNull();
    });

    test("head of blockchain points to null", () => {
        const block = startChain({
            abc: 123
        });

        expect(block.next).toBeNull();
    });
});

describe("addToChain", () => {
    test("returns type of Block", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
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

        expect(block.next).toHaveProperty("state");
        expect(block.next).toHaveProperty("index");
        expect(block.next).toHaveProperty("timestamp");
        expect(block.next).toHaveProperty("previousHash");
        expect(block.next).toHaveProperty("previous");
        expect(block.next).toHaveProperty("next");
        expect(block.next).toHaveProperty("nonce");
        expect(block.next).toHaveProperty("hash");
    });

    test("head of blockchain does not point to null", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);

        expect(block.next).not.toBeNull();
        expect(block.next.next).toBeNull();
    });

    test("head of blockchain has index 0", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);

        expect(block.index).toBe(0);
    });

    test("second block of blockchain points to null", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);

        expect(block.next.next).toBeNull();
    });

    test("second block of blockchain no longer points to null after adding another block", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);

        expect(block.next.next).toBeNull();

        addToChain({
            xyz: 999
        }, block);

        expect(block.next.next).not.toBeNull();
    });

    test("second block of blockchain has index 1", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);

        expect(block.next.index).toBe(1);
    });

    test("third block of blockchain has index 2", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);
        addToChain({
            xyz: 999
        }, block);

        expect(block.next.next.index).toBe(2);
    });

    test("blockchain hashes match", () => {
        let block = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, block);
        addToChain({
            xyz: 999
        }, block);

        let block0 = block;
        let block1 = block.next;
        let block2 = block.next.next;

        expect(block0.previousHash).toBeNull();
        expect(block1.previousHash).toBe(block0.hash);
        expect(block2.previousHash).toBe(block1.hash);
    });
});