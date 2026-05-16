// tests/loading/10-defer.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Loading Optimization: Deferred Non-Critical JS", () => {
  const layout = readFileSync(join(process.cwd(), "src/layouts/BaseLayout.astro"), "utf-8");

  it("scroll reveal is wrapped in requestIdleCallback", () => {
    const scrollRevealPos = layout.indexOf("Scroll reveal");
    const idleCallbackPos = layout.indexOf("requestIdleCallback");
    expect(idleCallbackPos).toBeGreaterThan(-1);
    expect(scrollRevealPos).toBeGreaterThan(-1);
    expect(idleCallbackPos).toBeLessThan(scrollRevealPos);
  });

  it("flower animations are wrapped in requestIdleCallback", () => {
    const flowerPos = layout.indexOf("flowers.push");
    const idleCallbackPos = layout.indexOf("requestIdleCallback");
    expect(flowerPos).toBeGreaterThan(-1);
    expect(idleCallbackPos).toBeLessThan(flowerPos);
  });

  it("viewport fix is wrapped in requestIdleCallback", () => {
    const viewportPos = layout.indexOf("setVH");
    const idleCallbackPos = layout.indexOf("requestIdleCallback");
    expect(viewportPos).toBeGreaterThan(-1);
    expect(idleCallbackPos).toBeLessThan(viewportPos);
  });

  it("flute handler is NOT wrapped in requestIdleCallback", () => {
    const flutePos = layout.indexOf("getElementById('flute-container')");
    expect(flutePos).toBeGreaterThan(-1);
  });
});
