const {
    Block
} = require('../src/index');

describe("getCurrentState", () => {
    let chain = new Block({
        abc: 123
    });

    test("unmutated state should match initial state", () => {
        let state = chain.getCurrentState();

        expect(state).toEqual({
            abc: 123
        });
    });

    test("mutated state should match new state", () => {
        chain.push({
            aaa: 321
        });

        let state = chain.getCurrentState();

        expect(state).toEqual({
            aaa: 321
        });
    });

    test("mutated state should match state of multiple keys", () => {
        chain.push({
            abc: "Something new!",
            aaa: 111,
            xyz: null
        });
        let state = chain.getCurrentState();

        expect(state).toEqual({
            abc: "Something new!",
            aaa: 111,
            xyz: null
        });
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
        let state = chain.getCurrentState();

        expect(state).toEqual({
            abc: 0
        });
    });
});

describe("getStateArray", () => {
    let chain = new Block({
        abc: 123
    });

    test("unmutated state should match initial state", () => {
        let state = chain.getStateArray();

        expect(state).toEqual([{
            abc: 123
        }]);
    });

    test("mutated state should match initial + new state", () => {
        chain.push({
            aaa: 321
        });

        let state = chain.getStateArray();

        expect(state).toEqual([{
            abc: 123
        }, {
            aaa: 321
        }]);
    });

    test("mutated state should match state of multiple keys", () => {
        chain.push({
            abc: "Something new!",
            aaa: 111,
            xyz: null
        });
        let state = chain.getStateArray();

        expect(state).toEqual([{
            abc: 123
        }, {
            aaa: 321
        }, {
            abc: "Something new!",
            aaa: 111,
            xyz: null
        }]);
    });
});

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

describe("getStateArrayOf", () => {
    let chain = new Block({
        abc: 123
    });

    test("unmutated state should match initial state", () => {
        let state = chain.getStateArrayOf("abc");

        expect(state).toEqual([123]);
    });

    test("mutated state should match initial state if mutations don't include our key", () => {
        chain.push({
            aaa: 321
        });

        let state = chain.getStateArrayOf("abc");

        expect(state).toEqual([123]);
    });

    test("mutated state should match state if mutations do include our key", () => {
        let state = chain.getStateArrayOf("aaa");

        expect(state).toEqual([321]);
    });

    test("mutated state should match state if mutations do include our initial key", () => {
        chain.push({
            abc: "Something new!"
        });
        let state = chain.getStateArrayOf("abc");

        expect(state).toEqual([123, "Something new!"]);
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
        let state = chain.getStateArrayOf("abc");

        expect(state).toEqual([123, "Something new!", "Something borrowed!", "Something blue!", {
            deep: "object!"
        }, 1, 1, 0]);
    });
});