const {
    startChain,
    addToChain,
    isChainValid,
} = require('../src/index');

describe("functions", () => {
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
    });

    describe("isChainValid", () => {
        test("genesis block is valid", () => {
            let chain = startChain({
                abc: 123
            });

            let isValid = isChainValid(chain);

            expect(isValid).toBe(true);
        });

        test("regular chain is valid", () => {
            let chain = startChain({
                abc: 123
            });
            addToChain({
                aaa: 321
            }, chain);
            addToChain({
                xyz: 999
            }, chain);

            let isValid = isChainValid(chain);

            expect(isValid).toBe(true);
        });

        test("tampered genesis block index is not valid", () => {
            let chain = startChain({
                abc: 123
            });
            chain.index = 30;

            let isValid = isChainValid(chain);

            expect(isValid).toBe(false);
        });

        test("tampered genesis block state is not valid", () => {
            let chain = startChain({
                abc: 123
            });
            chain.state.abc = 111;

            let isValid = isChainValid(chain);

            expect(isValid).toBe(false);
        });

        test("tampered genesis block timestamp is not valid", () => {
            let chain = startChain({
                abc: 123
            });

            chain.timestamp = Date.now() + 100;

            let isValid = isChainValid(chain);

            expect(isValid).toBe(false);
        });

        test("tampered regular chain index is not valid", () => {
            let chain = startChain({
                abc: 123
            });
            addToChain({
                aaa: 321
            }, chain);
            addToChain({
                xyz: 999
            }, chain);

            chain.next.index = 100;

            let isValid = isChainValid(chain);

            expect(isValid).toBe(false);
        });

        test("tampered regular chain state is not valid", () => {
            let chain = startChain({
                abc: 123
            });
            addToChain({
                aaa: 321
            }, chain);
            addToChain({
                xyz: 999
            }, chain);

            chain.next.state.aaa = 100;

            let isValid = isChainValid(chain);

            expect(isValid).toBe(false);
        });

        test("tampered regular chain addition to state is not valid", () => {
            let chain = startChain({
                abc: 123
            });
            addToChain({
                aaa: 321
            }, chain);
            addToChain({
                xyz: 999
            }, chain);

            chain.next.state.abc = 123;

            let isValid = isChainValid(chain);

            expect(isValid).toBe(false);
        });
    });

    test("tampered regular chain timestamp is not valid", () => {
        let chain = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, chain);
        addToChain({
            xyz: 999
        }, chain);

        chain.next.timestamp = Date.now() + 100;

        let isValid = isChainValid(chain);

        expect(isValid).toBe(false);
    });

    test("tampered regular chain hash is not valid", () => {
        let chain = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, chain);
        addToChain({
            xyz: 999
        }, chain);

        chain.next.timestamp = Date.now() + 100;
        chain.next.hash = chain.next.calculateHash();

        let isValid = isChainValid(chain);

        expect(isValid).toBe(false);
    });

    test("tampered regular chain previousHash is not valid", () => {
        let chain = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, chain);
        addToChain({
            xyz: 999
        }, chain);

        chain.next.timestamp = Date.now() + 100;
        chain.next.hash = chain.next.calculateHash();
        chain.next.next.previousHash = chain.next.calculateHash();

        let isValid = isChainValid(chain);

        expect(isValid).toBe(false);
    });

    test("tryhard tampering is not valid", () => {
        let chain = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, chain);
        addToChain({
            xyz: 999
        }, chain);

        chain.timestamp = Date.now() + 100;
        chain.next.state.aaa = "Tampering is bad!";
        chain.next.next.index = 100;
        chain.hash = chain.calculateHash();
        chain.next.previousHash = chain.calculateHash();
        chain.next.hash = chain.next.calculateHash();
        chain.next.next.previousHash = chain.next.calculateHash();
        chain.next.next.hash = chain.next.next.calculateHash();

        let isValid = isChainValid(chain);

        expect(isValid).toBe(false);
    });

    test("tryhard (with mining) tampering is not valid", () => {
        let chain = startChain({
            abc: 123
        });
        addToChain({
            aaa: 321
        }, chain);
        addToChain({
            xyz: 999
        }, chain);

        chain.timestamp = Date.now() + 100;
        chain.next.state.aaa = "Tampering is bad!";
        chain.next.next.index = 100;
        chain.hash = chain.mineNewBlock();
        chain.next.previousHash = chain.mineNewBlock();
        chain.next.hash = chain.next.mineNewBlock();
        chain.next.next.previousHash = chain.next.mineNewBlock();
        chain.next.next.hash = chain.next.next.mineNewBlock();

        let isValid = isChainValid(chain);

        expect(isValid).toBe(false);
    });
});

describe("blockchain properties", () => {
    let chain = startChain({
        abc: 123
    });
    addToChain({
        aaa: 321
    }, chain);
    addToChain({
        xyz: 999
    }, chain);

    let block0 = chain;
    let block1 = chain.next;
    let block2 = chain.next.next;

    test("blockchain hashes match", () => {
        expect(block0.previousHash).toBeNull();
        expect(block1.previousHash).toBe(block0.hash);
        expect(block2.previousHash).toBe(block1.hash);
    });

    test("previous values match", () => {
        expect(block0.previous).toBeNull();
        expect(block1.previous).toBe(block0);
        expect(block2.previous).toBe(block1);
    });

    test("next values match", () => {
        expect(block0.next).toBe(block1);
        expect(block1.next).toBe(block2);
        expect(block2.next).toBeNull();
    });

    test("blockchain indexes increment", () => {
        expect(block0.index).toBe(0);
        expect(block1.index).toBe(1);
        expect(block2.index).toBe(2);
    });

    test("state is maintained", () => {
        expect(block0.state.abc).toBe(123);
        expect(block1.state.aaa).toBe(321);
        expect(block2.state.xyz).toBe(999);
    });

    test("hashes are mined", () => {
        expect(block0.hash[0]).toBe("0");
        expect(block1.hash[0]).toBe("0");
        expect(block2.hash[0]).toBe("0");
    });
});