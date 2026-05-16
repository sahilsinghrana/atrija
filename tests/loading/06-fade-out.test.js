// tests/loading/06-fade-out.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Faster Fade-Out", () => {
  it("loader transition is 0.4s or less", () => {
    const css = readFileSync(join(process.cwd(), "public/css/loader.css"), "utf-8");
    const match = css.match(/#loader\s*\{[^}]*transition:\s*opacity\s+([\d.]+)s/);
    expect(match).toBeTruthy();
    const duration = parseFloat(match[1]);
    expect(duration).toBeLessThanOrEqual(0.4);
  });

  it("scene-init.js uses single rAF for loader fade (not double rAF)", () => {
    const scene = readFileSync(join(process.cwd(), "public/js/scene-init.js"), "utf-8");
    const doubleRafMatch = scene.match(/requestAnimationFrame\s*\(\s*function\s*\(\)\s*\{\s*requestAnimationFrame/);
    expect(doubleRafMatch).toBeNull();
  });
});
