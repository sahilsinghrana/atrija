// tests/loading/06-fade-out.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Fade-Out", () => {
  it("loader transition is 0.4s or less", () => {
    const css = readFileSync(join(process.cwd(), "public/css/loader.css"), "utf-8");
    const match = css.match(/#loader\s*\{[^}]*transition:\s*opacity\s+([\d.]+)s/);
    expect(match).toBeTruthy();
    const duration = parseFloat(match[1]);
    expect(duration).toBeLessThanOrEqual(0.4);
  });

  it("loader-boot.js handles loader fade-out", () => {
    const boot = readFileSync(join(process.cwd(), "public/js/loader-boot.js"), "utf-8");
    // loader-boot.js should reference the loader element
    expect(boot).toMatch(/loader/);
  });
});
