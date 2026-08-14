import { beforeEach, describe, expect, it, vi } from "vitest";
import { APP_KEYS } from "@open-design/sidecar-proto";
import type { StopProcessesResult } from "@open-design/platform";

vi.doMock("@open-design/sidecar", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@open-design/sidecar")>();
  return {
    ...actual,
    requestJsonIpc: vi.fn(),
  };
});

vi.doMock("@open-design/platform", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@open-design/platform")>();
  return {
    ...actual,
    isProcessAlive: vi.fn(),
    waitForProcessExit: vi.fn(),
    stopProcesses: vi.fn(),
  };
});

const sidecars = await import("../src/sidecars.js");

beforeEach(() => {
  vi.clearAllMocks();
});

const fakeStopResult = (pids: number[]): StopProcessesResult => ({
  alreadyStopped: false,
  forcedPids: pids,
  matchedPids: pids,
  remainingPids: [],
  stoppedPids: pids,
});

describe("retireExistingSidecarEndpoint", () => {
  it("waits for an existing sidecar to exit gracefully", async () => {
    const { requestJsonIpc } = await import("@open-design/sidecar");
    const { isProcessAlive, waitForProcessExit, stopProcesses } = await import("@open-design/platform");

    vi.mocked(requestJsonIpc)
      .mockResolvedValueOnce({ pid: 12345 })
      .mockResolvedValueOnce({ accepted: true });

    vi.mocked(isProcessAlive).mockReturnValue(true);
    vi.mocked(waitForProcessExit).mockResolvedValue(true);
    vi.mocked(stopProcesses).mockResolvedValue(fakeStopResult([12345]));

    await sidecars.retireExistingSidecarEndpoint(
      APP_KEYS.WEB,
      "/tmp/test.sock",
      "/tmp/test.log",
    );

    expect(isProcessAlive).toHaveBeenCalledWith(12345);
    expect(waitForProcessExit).toHaveBeenCalledWith(12345, 5000);
    expect(stopProcesses).not.toHaveBeenCalled();
  });

  it("force-stops a web sidecar that ignores graceful shutdown", async () => {
    const { requestJsonIpc } = await import("@open-design/sidecar");
    const { isProcessAlive, waitForProcessExit, stopProcesses } = await import("@open-design/platform");

    vi.mocked(requestJsonIpc)
      .mockResolvedValueOnce({ pid: 12345 })
      .mockResolvedValueOnce({ accepted: true });

    vi.mocked(isProcessAlive)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    vi.mocked(waitForProcessExit)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    vi.mocked(stopProcesses).mockResolvedValue(fakeStopResult([12345]));

    await sidecars.retireExistingSidecarEndpoint(
      APP_KEYS.WEB,
      "/tmp/test.sock",
      "/tmp/test.log",
    );

    expect(stopProcesses).toHaveBeenCalledWith([12345]);
    expect(waitForProcessExit).toHaveBeenCalledTimes(2);
    expect(waitForProcessExit).toHaveBeenLastCalledWith(12345, 5000);
  });

  it("uses a shorter graceful window for the daemon sidecar", async () => {
    const { requestJsonIpc } = await import("@open-design/sidecar");
    const { isProcessAlive, waitForProcessExit, stopProcesses } = await import("@open-design/platform");

    vi.mocked(requestJsonIpc)
      .mockResolvedValueOnce({ pid: 12345 })
      .mockResolvedValueOnce({ accepted: true });

    vi.mocked(isProcessAlive)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    vi.mocked(waitForProcessExit)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    vi.mocked(stopProcesses).mockResolvedValue(fakeStopResult([12345]));

    await sidecars.retireExistingSidecarEndpoint(
      APP_KEYS.DAEMON,
      "/tmp/test.sock",
      "/tmp/test.log",
    );

    expect(stopProcesses).toHaveBeenCalledWith([12345]);
    expect(waitForProcessExit).toHaveBeenCalledWith(12345, 2500);
    expect(waitForProcessExit).toHaveBeenLastCalledWith(12345, 5000);
  });
});
