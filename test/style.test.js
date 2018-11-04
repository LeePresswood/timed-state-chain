const {
    Block
} = require('../src/index');

describe("styling the chain", () => {
    test("can chain pushes to the blockchain", () => {
        let chain = new Block({
            abc: 123
        }).push({
            aaa: 321
        }).push({
            xyz: 999
        });

        expect(chain.getStateOf("abc")).toBe(123);
        expect(chain.getStateOf("aaa")).toBe(321);
        expect(chain.getStateOf("xyz")).toBe(999);
    });
});