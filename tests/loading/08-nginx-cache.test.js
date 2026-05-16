// tests/loading/08-nginx-cache.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";

describe("Loading Optimization: Nginx Caching", () => {
  const nginxConf = readFileSync("/data/data/com.termux/files/usr/etc/nginx/nginx.conf", "utf-8");

  it("has gzip enabled", () => {
    expect(nginxConf).toMatch(/gzip\s+on\s*;/);
  });

  it("gzip includes SVG type", () => {
    expect(nginxConf).toMatch(/gzip_types[^;]*image\/svg\+xml/);
  });

  it("has immutable cache for CSS/JS assets", () => {
    expect(nginxConf).toMatch(/Cache-Control[^)]*immutable/);
  });

  it("has 1-year max-age for assets", () => {
    expect(nginxConf).toMatch(/max-age=31536000/);
  });

  it("HTML has no-cache or short revalidate", () => {
    expect(nginxConf).toMatch(/html[^}]*no-cache|must-revalidate/);
  });
});
