import { BehaviorSubject } from "rxjs";
type AuthProps = {
  sessionToken: string | null;
  error: string | undefined;
  pending: boolean;
};
export declare const INTERVAL_CHECK_IN_MILISECONDS = 2500;
export declare const auth$: BehaviorSubject<AuthProps>;
export declare function login(username: string, password: string): void;
export declare function logout(): void;
export {};
