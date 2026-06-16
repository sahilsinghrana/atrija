// tests/loading/11-content-visibility.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Build Configuration", () => {
  it("astro.config.mjs has cssCodeSplit: false", () => {
    const config = readFileSync(join(process.cwd(), "astro.config.mjs"), "utf-8");
    expect(config).toMatch(/cssCodeSplit:\s*false/);
  });

  it("astro.config.mjs uses static output mode", () => {
    const config = readFileSync(join(process.cwd(), "astro.config.mjs"), "utf-8");
    expect(config).toMatch(/output:\s*'static'/);
  });

  it("astro.config.mjs includes three.js in optimizeDeps", () => {
    const config = readFileSync(join(process.cwd(), "astro.config.mjs"), "utf-8");
    expect(config).toMatch(/optimizeDeps/);
    expect(config).toMatch(/include:\s*\[/);
  });

  it("vite-scene.config.js exists for scene bundling", () => {
    const path = join(process.cwd(), "vite-scene.config.js");
    expect(require("fs").existsSync(path)).toBe(true);
  });
});
