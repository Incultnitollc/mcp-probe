import { describe, it, expect } from "vitest";
import { generateSampleArgs } from "./sample-args.js";

describe("generateSampleArgs", () => {
  it("generates string for required string field", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    });
    expect(args).toEqual({ name: "test" });
  });

  it("generates number for required number field", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        count: { type: "number" },
      },
      required: ["count"],
    });
    expect(args).toEqual({ count: 1 });
  });

  it("skips optional fields", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        required_field: { type: "string" },
        optional_field: { type: "string" },
      },
      required: ["required_field"],
    });
    expect(args).toEqual({ required_field: "test" });
    expect(args).not.toHaveProperty("optional_field");
  });

  it("uses default value when available", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        mode: { type: "string", default: "fast" },
      },
      required: ["mode"],
    });
    expect(args).toEqual({ mode: "fast" });
  });

  it("uses first enum value", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        color: { type: "string", enum: ["red", "blue", "green"] },
      },
      required: ["color"],
    });
    expect(args).toEqual({ color: "red" });
  });

  it("generates URL for url-named fields", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        callback_url: { type: "string" },
      },
      required: ["callback_url"],
    });
    expect(args.callback_url).toBe("https://example.com");
  });

  it("returns empty object for no required fields", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        optional: { type: "string" },
      },
    });
    expect(args).toEqual({});
  });
});
