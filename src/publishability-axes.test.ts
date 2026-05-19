import { describe, it, expect } from "vitest";
import { scoreDescriptionAxes } from "./publishability-axes.js";

describe("scoreDescriptionAxes", () => {
  it("returns 0 axes for an empty description", () => {
    const out = scoreDescriptionAxes("");
    expect(out.axesPassed).toBe(0);
  });

  it("returns 0 axes for a trivial description", () => {
    const out = scoreDescriptionAxes("the id");
    expect(out.axesPassed).toBe(0);
  });

  it("scores type axis when description mentions a type", () => {
    const out = scoreDescriptionAxes("UTF-8 string");
    expect(out.axes.type).toBe(true);
  });

  it("scores constraints axis when description mentions length/pattern/range", () => {
    const out = scoreDescriptionAxes("Up to 200 characters");
    expect(out.axes.constraints).toBe(true);
  });

  it("scores notAxis (what not to pass) on negative phrasing", () => {
    const out = scoreDescriptionAxes("Do not pass null.");
    expect(out.axes.notAxis).toBe(true);
  });

  it("scores mutation axis on read/write language", () => {
    const out = scoreDescriptionAxes("Mutating. Writes to disk.");
    expect(out.axes.mutation).toBe(true);
  });

  it("scores example axis on 'e.g.' or 'example:'", () => {
    const out = scoreDescriptionAxes("Path. Example: /tmp/x.txt");
    expect(out.axes.example).toBe(true);
  });

  it("scores 5/5 on a full description", () => {
    const out = scoreDescriptionAxes(
      "UTF-8 string, up to 200 chars. Do not pass null. Read-only — only narrows a query. Example: 'Meeting notes'."
    );
    expect(out.axesPassed).toBe(5);
  });
});
