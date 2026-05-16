// tests/loading/11-content-visibility.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Content Visibility", () => {
  it("BaseLayout CSS has content-visibility: auto on sections", () => {
    const layout = readFileSync(join(process.cwd(), "src/layouts/BaseLayout.astro"), "utf-8");
    expect(layout).toMatch(/content-visibility:\s*auto/);
  });

  it("sections have contain-intrinsic-size", () => {
    const layout = readFileSync(join(process.cwd(), "src/layouts/BaseLayout.astro"), "utf-8");
    expect(layout).toMatch(/contain-intrinsic-size/);
  });

  it("astro.config.mjs has cssCodeSplit: false", () => {
    const config = readFileSync(join(process.cwd(), "astro.config.mjs"), "utf-8");
    expect(config).toMatch(/cssCodeSplit:\s*false/);
  });
});
