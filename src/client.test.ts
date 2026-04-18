import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, symlinkSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseAllowedDirectories } from "./client.js";

describe("parseAllowedDirectories", () => {
  it("returns empty array for non-array content", () => {
    expect(parseAllowedDirectories(undefined)).toEqual([]);
    expect(parseAllowedDirectories(null)).toEqual([]);
    expect(parseAllowedDirectories("not an array")).toEqual([]);
    expect(parseAllowedDirectories({})).toEqual([]);
  });

  it("returns empty array for empty content array", () => {
    expect(parseAllowedDirectories([])).toEqual([]);
  });

  it("ignores items without a text field", () => {
    expect(parseAllowedDirectories([{ type: "image" }, null, "string"])).toEqual([]);
  });

  it("extracts a single absolute path from a text item", () => {
    const dirs = parseAllowedDirectories([{ type: "text", text: "/private/tmp" }]);
    expect(dirs).toEqual(["/private/tmp"]);
  });

  it("extracts multiple absolute paths from newline-separated text", () => {
    const dirs = parseAllowedDirectories([
      { type: "text", text: "/private/tmp\n/private/var/folders" },
    ]);
    expect(dirs).toEqual(["/private/tmp", "/private/var/folders"]);
  });

  it("strips bullet/dash prefixes", () => {
    const dirs = parseAllowedDirectories([
      { type: "text", text: "- /private/tmp\n* /private/var\n• /Users/test" },
    ]);
    expect(dirs).toEqual(["/private/tmp", "/private/var", "/Users/test"]);
  });

  it("ignores non-absolute paths", () => {
    const dirs = parseAllowedDirectories([
      { type: "text", text: "Allowed directories:\nrelative/path\n./also-relative" },
    ]);
    expect(dirs).toEqual([]);
  });

  it("deduplicates repeated paths", () => {
    const dirs = parseAllowedDirectories([
      { type: "text", text: "/private/tmp\n/private/tmp" },
      { type: "text", text: "/private/tmp" },
    ]);
    expect(dirs).toEqual(["/private/tmp"]);
  });

  it("keeps non-existent paths as-is when realpath fails", () => {
    const fake = "/this/path/definitely/does/not/exist/mcp-probe-test";
    const dirs = parseAllowedDirectories([{ type: "text", text: fake }]);
    expect(dirs).toEqual([fake]);
  });

  it("recognizes Windows-style drive paths", () => {
    const dirs = parseAllowedDirectories([
      { type: "text", text: "C:\\Users\\test\nD:/data" },
    ]);
    expect(dirs).toEqual(["C:\\Users\\test", "D:/data"]);
  });

  describe("symlink normalization via realpath", () => {
    let workDir: string;
    let realTarget: string;
    let symlinkPath: string;

    beforeAll(() => {
      workDir = realpathSync(mkdtempSync(path.join(tmpdir(), "mcp-probe-test-")));
      realTarget = path.join(workDir, "real");
      symlinkPath = path.join(workDir, "link");
      mkdirSync(realTarget);
      symlinkSync(realTarget, symlinkPath);
    });

    afterAll(() => {
      rmSync(workDir, { recursive: true, force: true });
    });

    it("normalizes symlinked paths to their real target", () => {
      const dirs = parseAllowedDirectories([{ type: "text", text: symlinkPath }]);
      expect(dirs).toEqual([realTarget]);
    });

    it("deduplicates a symlink and its target after normalization", () => {
      const dirs = parseAllowedDirectories([
        { type: "text", text: `${symlinkPath}\n${realTarget}` },
      ]);
      expect(dirs).toEqual([realTarget]);
    });
  });
});
