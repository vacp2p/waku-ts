import Waku from "../src";

describe("Waku", () => {
  it("needs tests", async () => {
    const waku = new Waku("http://localhost:8545");
    expect(waku).toBeTruthy();
  });
});
