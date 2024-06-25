import { beforeAll, vi, expect } from "vitest";
import wait from "waait";

// The miniwasm server takes a while to start up. Below hack makes sure the server is up before running tests.

beforeAll(() =>
  vi
    .waitFor(
      () =>
        expect(fetch("http://localhost:26657/health")).resolves.toBeTruthy(),
      { timeout: 20_000 }
    )
    .then(() => wait(1000))
);
