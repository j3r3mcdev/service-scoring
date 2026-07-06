import { add } from "../src/math";

describe("add()", () => {
  it("should add numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
