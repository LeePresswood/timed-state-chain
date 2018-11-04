const {
    Block
} = require('../src/index');

describe("blockchain properties", () => {
    let chain = new Block({
        abc: 123
    });
    chain.push({
        aaa: 321
    });
    chain.push({
        xyz: 999
    });

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