// tests/loading/10-defer.test.js
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Deferred Non-Critical JS", () => {
  const index = readFileSync(join(process.cwd(), "src/pages/index.astro"), "utf-8");
  const layout = readFileSync(join(process.cwd(), "src/layouts/BaseLayout.astro"), "utf-8");

  it("scene-bundle.js is loaded with defer attribute in index.astro", () => {
    expect(index).toMatch(/scene-bundle\.js["'][^>]*defer/);
  });

  it("accessibility.js is loaded as standalone module in BaseLayout.astro", () => {
    const path = join(process.cwd(), "public/js/accessibility.js");
    expect(existsSync(path)).toBe(true);
    expect(layout).toMatch(/accessibility\.js/);
  });

  it("performance-scaler.js is loaded as standalone module in BaseLayout.astro", () => {
    const path = join(process.cwd(), "public/js/performance-scaler.js");
    expect(existsSync(path)).toBe(true);
    expect(layout).toMatch(/performance-scaler\.js/);
  });

  it("loader-boot.js handles loader lifecycle with setTimeout safety", () => {
    const boot = readFileSync(join(process.cwd(), "public/js/loader-boot.js"), "utf-8");
    expect(boot).toMatch(/setTimeout/);
    expect(boot).toMatch(/loader-progress-bar/);
    expect(boot).toMatch(/__updateLoaderProgress/);
  });
});
