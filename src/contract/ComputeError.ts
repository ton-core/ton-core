import { Maybe } from "../utils/maybe";

export class ComputeError extends Error {
    exitCode: number;
    debugLogs: string | null;
    logs: string | null;

    constructor(message: string, exitCode: number, opts?: { debugLogs?: Maybe<string>, logs?: Maybe<string> }) {
        super(message);
        this.exitCode = exitCode;
        this.debugLogs = opts && opts.debugLogs ? opts.debugLogs : null;
        this.logs = opts && opts.logs ? opts.logs : null;
        Object.setPrototypeOf(this, ComputeError.prototype);
    }
}