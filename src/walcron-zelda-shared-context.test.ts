import { auth$, name } from "./walcron-zelda-shared-context";

describe("shared libraries", () => {
  it("should show name", () => {
    expect(name).toBe("shared-context");
  });

  it("should be able to get authentications exported methods", () => {
    expect(auth$).toBeDefined();
  });
});
