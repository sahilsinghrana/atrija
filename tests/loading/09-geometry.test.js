// tests/loading/09-geometry.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Reduced Initial Geometry", () => {
  const scene = readFileSync(join(process.cwd(), "public/js/scene-init.js"), "utf-8");

  it("has initial reduced star count variable", () => {
    expect(scene).toMatch(/initialStarCount|initialStars|phase1Stars/i);
  });

  it("has isLowEnd check for mobile reductions", () => {
    expect(scene).toMatch(/isLowEnd|isMobile/);
  });

  it("wave segments configurable for reduced initial load", () => {
    expect(scene).toMatch(/waveSegments|waveDetail|WAVE_SEG/i);
  });
});
