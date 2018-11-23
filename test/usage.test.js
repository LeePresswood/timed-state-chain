const {
    Block
} = require('../src/index');

describe("usage", () => {
    test("can make individual pushes to the blockchain", () => {
        let chain = new Block({
            abc: 123
        });
        chain.push({
            aaa: 321
        })
        chain.push({
            xyz: 999
        });

        expect(chain.getCurrentStateOf("abc")).toBe(123);
        expect(chain.getCurrentStateOf("aaa")).toBe(321);
        expect(chain.getCurrentStateOf("xyz")).toBe(999);
    });

    test("can replace chain with individual pushes to the blockchain", () => {
        let chain = new Block({
            abc: 123
        });

        chain = chain.push({
            aaa: 321
        })
        chain.push({
            xyz: 999
        });

        expect(chain.getCurrentStateOf("abc")).toBe(123);
        expect(chain.getCurrentStateOf("aaa")).toBe(321);
        expect(chain.getCurrentStateOf("xyz")).toBe(999);
    });

    test("can chain pushes to the blockchain", () => {
        let chain = new Block({
            abc: 123
        }).push({
            aaa: 321
        }).push({
            xyz: 999
        });

        expect(chain.getCurrentStateOf("abc")).toBe(123);
        expect(chain.getCurrentStateOf("aaa")).toBe(321);
        expect(chain.getCurrentStateOf("xyz")).toBe(999);
    });

    test("can chain pushes to the blockchain after original creation", () => {
        let chain = new Block({
            abc: 123
        });

        chain.push({
            aaa: 321
        }).push({
            xyz: 999
        });

        expect(chain.getCurrentStateOf("abc")).toBe(123);
        expect(chain.getCurrentStateOf("aaa")).toBe(321);
        expect(chain.getCurrentStateOf("xyz")).toBe(999);
    });
});