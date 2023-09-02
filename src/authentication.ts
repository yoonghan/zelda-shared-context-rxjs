import { BehaviorSubject } from "rxjs";
import { credentials, sessionToken } from "./const/sample";

type AuthProps = {
  sessionToken: string | null;
  error: string | undefined;
  pending: boolean;
};

export const INTERVAL_CHECK_IN_MILISECONDS = 2500;

export const auth$ = new BehaviorSubject<AuthProps>({
  sessionToken: localStorage.getItem("sessionToken"),
  error: undefined,
  pending: false,
});

// This promise represents a request being made to some backend to have the user validated and logged in
// but is mocked here for convenience. I don't want to have to setup a backend just for this example.
const GET_LOGGED_IN = (
  username: string,
  password: string
): Promise<AuthProps> =>
  new Promise((resolve) => {
    auth$.next({
      sessionToken: null,
      error: undefined,
      pending: true,
    });
    setTimeout(() => {
      if (
        username === credentials.username &&
        password === credentials.password
      ) {
        localStorage.setItem("sessionToken", sessionToken);
        resolve({
          sessionToken,
          error: undefined,
          pending: false,
        });
      } else {
        // Why resolve when invalid? Because the "backend" provided a valid response
        resolve({
          sessionToken: null,
          error: "Invalid user or password",
          pending: false,
        });
      }
    }, INTERVAL_CHECK_IN_MILISECONDS);
  });

export function login(username: string, password: string) {
  if (!auth$.value.pending) {
    GET_LOGGED_IN(username, password).then((user) => {
      auth$.next(user);
    });
  }
}

export function logout() {
  localStorage.removeItem("sessionToken");
  auth$.next({
    sessionToken: null,
    error: undefined,
    pending: false,
  });
}
