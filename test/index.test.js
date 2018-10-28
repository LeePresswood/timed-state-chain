const {
    Block,
    getGenesisBlock
} = require('../src/index');

describe("Block", () => {
    describe("constructor", () => {
        test("uses passed in index", () => {
            const block1 = new Block(0);
            const block2 = new Block(10);
            const block3 = new Block(100);

            expect(block1.index).toBe(0);
            expect(block2.index).toBe(10);
            expect(block3.index).toBe(100);
        });

        test("uses passed in timestamp", () => {
            const block1 = new Block(1, {}, new Date(2018, 9, 24));
            const block2 = new Block(2, {}, new Date(2018, 10, 25));
            const block3 = new Block(3, {}, new Date(2018, 11, 26));

            expect(block1.timestamp.getFullYear()).toBe(2018);
            expect(block1.timestamp.getMonth()).toBe(9);
            expect(block1.timestamp.getDate()).toBe(24);

            expect(block2.timestamp.getFullYear()).toBe(2018);
            expect(block2.timestamp.getMonth()).toBe(10);
            expect(block2.timestamp.getDate()).toBe(25);

            expect(block3.timestamp.getFullYear()).toBe(2018);
            expect(block3.timestamp.getMonth()).toBe(11);
            expect(block3.timestamp.getDate()).toBe(26);
        });

        test("uses passed in state", () => {
            const block1 = new Block(1, {
                a: 1
            }, new Date(2018, 9, 24));
            const block2 = new Block(2, {
                b: 2
            }, new Date(2018, 10, 25));
            const block3 = new Block(3, {
                c: 3
            }, new Date(2018, 11, 26));

            expect(block1.state.a).toBe(1);
            expect(block2.state.b).toBe(2);
            expect(block3.state.c).toBe(3);
        });

        test("provides empty state if not provided one", () => {
            const block1 = new Block(1);

            expect(block1.state).toEqual({});
        });

        test("uses passed in timestamp", () => {
            const block1 = new Block(1, {}, new Date(2018, 9, 24));
            const block2 = new Block(2, {}, new Date(2018, 10, 25));
            const block3 = new Block(3, {}, new Date(2018, 11, 26));

            expect(block1.timestamp.getFullYear()).toBe(2018);
            expect(block1.timestamp.getMonth()).toBe(9);
            expect(block1.timestamp.getDate()).toBe(24);

            expect(block2.timestamp.getFullYear()).toBe(2018);
            expect(block2.timestamp.getMonth()).toBe(10);
            expect(block2.timestamp.getDate()).toBe(25);

            expect(block3.timestamp.getFullYear()).toBe(2018);
            expect(block3.timestamp.getMonth()).toBe(11);
            expect(block3.timestamp.getDate()).toBe(26);
        });

        test("provides timestamp if not provided one", () => {
            const block1 = new Block(1);
            const laterDate = Date.now() + 1000;

            expect(block1.timestamp).toBeLessThan(laterDate);
        });

        test("uses passed in previousHash", () => {
            const block1 = new Block(1, {}, new Date(), "abc");
            const block2 = new Block(2, {}, new Date(), "abcd");
            const block3 = new Block(3, {}, new Date(), "abcde");

            expect(block1.previousHash).toBe("abc");
            expect(block2.previousHash).toBe("abcd");
            expect(block3.previousHash).toBe("abcde");
        });

        test("provides null previousHash if not provided one", () => {
            const block1 = new Block(1, new Date());

            expect(block1.previousHash).toBeNull();
        });

        test("nonce starts as 0", () => {
            const block1 = new Block(1, {}, new Date(), "abc");
            const block2 = new Block(2, {}, new Date(), "abcd");
            const block3 = new Block(3, {}, new Date(), "abcde");

            expect(block1.nonce).toBe(0);
            expect(block2.nonce).toBe(0);
            expect(block3.nonce).toBe(0);
        });

        test("hash is calculated", () => {
            const block1 = new Block(1, {}, new Date(), "abc");
            const block2 = new Block(2, {}, new Date(), "abcd");
            const block3 = new Block(3, {}, new Date(), "abcde");

            expect(block1.hash).toHaveLength(64);
            expect(block2.hash).toHaveLength(64);
            expect(block3.hash).toHaveLength(64);
        });
    });

    describe("calculateHash", () => {
        test("hash is string", () => {
            const hash = new Block(1).calculateHash();

            expect(typeof hash).toBe("string");
        });

        test("hash is length 64", () => {
            const hash = new Block(1).calculateHash();

            expect(hash).toHaveLength(64);
        });

        test("hashes of two of the same objects are equal", () => {
            const block = new Block(1);
            const hash1 = block.calculateHash();
            const hash2 = block.calculateHash();

            expect(hash1).toBe(hash2);
        });

        test("hashes of two of different blocks with the same data are equal", () => {
            const block1 = new Block(1, {}, 123);
            const block2 = new Block(1, {}, 123);
            const hash1 = block1.calculateHash();
            const hash2 = block2.calculateHash();

            expect(hash1).toBe(hash2);
        });

        test("hashes of two of different blocks with different data are not equal", () => {
            const block1 = new Block(1, {}, 123);
            const block2 = new Block(11, {}, 123);
            const hash1 = block1.calculateHash();
            const hash2 = block2.calculateHash();

            expect(hash1).not.toBe(hash2);
        });
    });
});

describe("getGenesisBlock", () => {
    test("returns block", () => {
        const genesisBlock = getGenesisBlock();

        expect(genesisBlock instanceof Block).toBe(true);
    });

    test("index is 0", () => {
        const genesisBlock = getGenesisBlock();

        expect(genesisBlock.index).toBe(0);
    });

    test("state is empty object if none is passed in", () => {
        const genesisBlock = getGenesisBlock();

        expect(genesisBlock.state).toMatchObject({});
    });

    test("state uses passed in object", () => {
        const genesisBlock = getGenesisBlock({
            abc: 123
        });

        expect(genesisBlock.state).toMatchObject({
            abc: 123
        });
    });

    test("timestamp uses current time", () => {
        const genesisBlock = getGenesisBlock();
        const laterTime = Date.now() + 1;

        expect(genesisBlock.timestamp).toBeLessThan(laterTime);
    });

    test("previousHash is null", () => {
        const genesisBlock = getGenesisBlock();

        expect(genesisBlock.previousHash).toBeNull();
    });
});