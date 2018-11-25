const {
    Block
} = require('../src/index');

describe("Block", () => {
    describe("constructor", () => {
        test("returns type of Block", () => {
            const block = new Block({
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
            const block = new Block({
                abc: 123
            });

            expect(block.next).toBeNull();
        });

        test("can use null as state", () => {
            const block = new Block(null);

            expect(block.getCurrentState()).toBeNull();
        });

        test("can use undefined as state", () => {
            const block = new Block();

            expect(block.getCurrentState()).toBeUndefined();
        });

        test("can use empty object as state", () => {
            const block = new Block({});

            expect(block.getCurrentState()).toMatchObject({});
        });

        test("can't use number as state", () => {
            const block = new Block(123);

            expect(block.errorFlag).toBe(true);
        });

        test("can't use string as state", () => {
            const block = new Block("Won't work");

            expect(block.errorFlag).toBe(true);
        });
    });

    describe("push", () => {
        test("returns type of Block", () => {
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });

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
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });

            expect(block.next).not.toBeNull();
            expect(block.next.next).toBeNull();
        });

        test("head of blockchain has index 0", () => {
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });

            expect(block.index).toBe(0);
        });

        test("second block of blockchain points to null", () => {
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });

            expect(block.next.next).toBeNull();
        });

        test("second block of blockchain no longer points to null after adding another block", () => {
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });

            expect(block.next.next).toBeNull();

            block.push({
                xyz: 999
            });

            expect(block.next.next).not.toBeNull();
        });

        test("second block of blockchain has index 1", () => {
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });

            expect(block.next.index).toBe(1);
        });

        test("third block of blockchain has index 2", () => {
            let block = new Block({
                abc: 123
            });
            block.push({
                aaa: 321
            });
            block.push({
                xyz: 999
            });

            expect(block.next.next.index).toBe(2);
        });
    });

    describe("isValid", () => {
        test("genesis block is valid", () => {
            let chain = new Block({
                abc: 123
            });

            let isValid = chain.isValid();

            expect(isValid).toBe(true);
        });

        test("regular chain is valid", () => {
            let chain = new Block({
                abc: 123
            });
            chain.push({
                aaa: 321
            });
            chain.push({
                xyz: 999
            });

            let isValid = chain.isValid();

            expect(isValid).toBe(true);
        });

        test("tampered genesis block index is not valid", () => {
            let chain = new Block({
                abc: 123
            });

            chain.index = 30;

            let isValid = chain.isValid();

            expect(isValid).toBe(false);
        });

        test("tampered genesis block state is not valid", () => {
            let chain = new Block({
                abc: 123
            });

            chain.state.abc = 111;

            let isValid = chain.isValid();

            expect(isValid).toBe(false);
        });

        test("tampered genesis block timestamp is not valid", () => {
            let chain = new Block({
                abc: 123
            });

            chain.timestamp = Date.now() + 100;

            let isValid = chain.isValid();

            expect(isValid).toBe(false);
        });

        test("tampered regular chain index is not valid", () => {
            let chain = new Block({
                abc: 123
            });
            chain.push({
                aaa: 321
            });
            chain.push({
                xyz: 999
            });

            chain.next.index = 100;

            let isValid = chain.isValid();

            expect(isValid).toBe(false);
        });

        test("tampered regular chain state is not valid", () => {
            let chain = new Block({
                abc: 123
            });
            chain.push({
                aaa: 321
            });
            chain.push({
                xyz: 999
            });

            chain.next.state.aaa = 100;

            let isValid = chain.isValid();

            expect(isValid).toBe(false);
        });

        test("tampered regular chain addition to state is not valid", () => {
            let chain = new Block({
                abc: 123
            });
            chain.push({
                aaa: 321
            });
            chain.push({
                xyz: 999
            });

            chain.next.state.abc = 123;

            let isValid = chain.isValid();

            expect(isValid).toBe(false);
        });
    });

    test("tampered regular chain timestamp is not valid", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.next.timestamp = Date.now() + 100;

        let isValid = chain.isValid();

        expect(isValid).toBe(false);
    });

    test("tampered regular chain hash is not valid", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.next.timestamp = Date.now() + 100;
        chain.next.hash = chain.next.calculateHash();

        let isValid = chain.isValid();

        expect(isValid).toBe(false);
    });

    test("tampered regular chain previousHash is not valid", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.next.timestamp = Date.now() + 100;
        chain.next.hash = chain.next.calculateHash();
        chain.next.next.previousHash = chain.next.calculateHash();

        let isValid = chain.isValid();

        expect(isValid).toBe(false);
    });

    test("tryhard tampering is not valid", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.timestamp = Date.now() + 100;
        chain.next.state.aaa = "Tampering is bad!";
        chain.next.next.index = 100;
        chain.hash = chain.calculateHash();
        chain.next.previousHash = chain.calculateHash();
        chain.next.hash = chain.next.calculateHash();
        chain.next.next.previousHash = chain.next.calculateHash();
        chain.next.next.hash = chain.next.next.calculateHash();

        let isValid = chain.isValid();

        expect(isValid).toBe(false);
    });

    test("tryhard (with mining) tampering is not valid", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.timestamp = Date.now() + 100;
        chain.next.state.aaa = "Tampering is bad!";
        chain.next.next.index = 100;
        chain.hash = chain.mineNewBlock();
        chain.next.previousHash = chain.mineNewBlock();
        chain.next.hash = chain.next.mineNewBlock();
        chain.next.next.previousHash = chain.next.mineNewBlock();
        chain.next.next.hash = chain.next.next.mineNewBlock();

        let isValid = chain.isValid();

        expect(isValid).toBe(false);
    });

    test("tryhard (with mining and circumventing mining check) tampering is valid", () => {
        //Note -- this test effectively requires you to recalculate the entire chain.
        //It's already awful with three block. Imagine a few thousand (or more).
        //Couple that with the fact that -- were we to use a longer-lasting mining
        //algorithm -- there wouldn't be enough time to remine everything.
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.timestamp = Date.now() + 100;
        chain.next.state.aaa = "Tampering is bad!";
        chain.next.next.index = 100;
        chain.hash = null;
        chain.hash = chain.mineNewBlock();
        chain.next.previousHash = null;
        chain.next.previousHash = chain.mineNewBlock();
        chain.next.hash = null;
        chain.next.hash = chain.next.mineNewBlock();
        chain.next.next.previousHash = null;
        chain.next.next.previousHash = chain.next.mineNewBlock();
        chain.next.next.hash = null;
        chain.next.next.hash = chain.next.next.mineNewBlock();

        let isValid = chain.isValid();

        expect(isValid).toBe(true);
    });

    test("changing state of getCurrentState() is invalid", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        });
        chain.push({
            xyz: 999
        });

        chain.getCurrentState().xyz = 1000;

        let isValid = chain.isValid();

        expect(isValid).toBe(false);
    });
});