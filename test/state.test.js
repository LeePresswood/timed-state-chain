const {
    Block
} = require('../src/index');

describe("getCurrentStateOf", () => {
    let chain = new Block({
        abc: 123
    });

    test("unmutated state should match initial state", () => {
        let state = chain.getCurrentStateOf("abc");

        expect(state).toBe(123);
    });

    test("mutated state should match initial state if mutations don't include our key", () => {
        chain.push({
            aaa: 321
        });

        let state = chain.getCurrentStateOf("abc");

        expect(state).toBe(123);
    });

    test("mutated state should match state if mutations do include our key", () => {
        let state = chain.getCurrentStateOf("aaa");

        expect(state).toBe(321);
    });

    test("mutated state should match state if mutations do include our initial key", () => {
        chain.push({
            abc: "Something new!"
        });
        let state = chain.getCurrentStateOf("abc");

        expect(state).toBe("Something new!");
    });

    test("mutated state should match state if mutations happen multiple times", () => {
        chain.push({
            abc: "Something borrowed!"
        });
        chain.push({
            abc: "Something blue!"
        });
        chain.push({
            abc: {
                deep: "object!"
            }
        });
        chain.push({
            abc: 1
        });
        chain.push({
            cba: 1
        });
        chain.push({
            abc: 1
        });
        chain.push({
            cba: 1
        });
        chain.push({
            abc: 0
        });
        let state = chain.getCurrentStateOf("abc");

        expect(state).toBe(0);
    });
});