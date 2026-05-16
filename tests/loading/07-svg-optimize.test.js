// tests/loading/07-svg-optimize.test.js
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

describe("Loading Optimization: SVG Optimization", () => {
  const svgDir = join(process.cwd(), "public/images");
  const svgFiles = readdirSync(svgDir).filter(f => f.endsWith(".svg"));

  it("has SVG files to optimize", () => {
    expect(svgFiles.length).toBeGreaterThan(0);
  });

  svgFiles.forEach(file => {
    it(file + " has no XML declaration", () => {
      const content = readFileSync(join(svgDir, file), "utf-8");
      expect(content).not.toMatch(/<\?xml/);
    });

    it(file + " has no comments", () => {
      const content = readFileSync(join(svgDir, file), "utf-8");
      expect(content).not.toMatch(/<!--[\s\S]*?-->/);
    });
  });
});
