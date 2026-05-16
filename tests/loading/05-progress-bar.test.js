// tests/loading/05-progress-bar.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Progress Bar", () => {
  it("loader HTML contains progress bar element", () => {
    const layout = readFileSync(join(process.cwd(), "src/layouts/BaseLayout.astro"), "utf-8");
    expect(layout).toMatch(/loader-progress-bar/);
    expect(layout).toMatch(/loader-progress/);
  });

  it("loader-progress.js exists", () => {
    const path = join(process.cwd(), "public/js/loader-progress.js");
    expect(require("fs").existsSync(path)).toBe(true);
  });

  it("loader CSS has progress bar styles", () => {
    const css = readFileSync(join(process.cwd(), "public/css/loader.css"), "utf-8");
    expect(css).toMatch(/\.loader-progress\s*\{/);
    expect(css).toMatch(/\.loader-progress-bar\s*\{/);
  });

  it("progress bar has transition for smooth width changes", () => {
    const css = readFileSync(join(process.cwd(), "public/css/loader.css"), "utf-8");
    expect(css).toMatch(/transition:\s*width/);
  });
});
