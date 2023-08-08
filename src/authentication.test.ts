import {
  INTERVAL_CHECK_IN_MILISECONDS,
  auth$,
  login,
  logout,
} from "./walcron-zelda-shared-context";

describe("authentication", () => {
  it("should have default auth$ can subscribe and unsubscribe", async () => {
    expect(auth$.value).toStrictEqual({
      pending: false,
      error: undefined,
      sessionToken: null,
    });
  });

  it("should be able to login successfully, then logout", (done) => {
    login("exampleuser", "examplepassword");

    expect(auth$.value).toStrictEqual({
      sessionToken: null,
      error: undefined,
      pending: true,
    });

    setTimeout(() => {
      expect(auth$.value).toStrictEqual({
        sessionToken: "abc123def456",
        error: undefined,
        pending: false,
      });
      logout();
      expect(auth$.value).toStrictEqual({
        pending: false,
        error: undefined,
        sessionToken: null,
      });
      done();
    }, INTERVAL_CHECK_IN_MILISECONDS);
  });

  it("should be able fail to login, and still triggers logout", (done) => {
    login("invaliduser", "invalidpassword");
    expect(auth$.value).toStrictEqual({
      sessionToken: null,
      error: undefined,
      pending: true,
    });
    setTimeout(() => {
      expect(auth$.value).toStrictEqual({
        sessionToken: null,
        error: "Invalid user or password",
        pending: false,
      });
      logout();
      expect(auth$.value).toStrictEqual({
        pending: false,
        error: undefined,
        sessionToken: null,
      });
      done();
    }, INTERVAL_CHECK_IN_MILISECONDS);
  });

  it("should skip double relogin relogin when it's pending", () => {
    login("invaliduser", "invalidpassword");
    login("invaliduser", "invalidpassword");
    expect(auth$.value).toStrictEqual({
      sessionToken: null,
      error: undefined,
      pending: true,
    });
  });
});
