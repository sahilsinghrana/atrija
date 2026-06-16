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

  it("CSS/JS have cache with must-revalidate", () => {
    expect(nginxConf).toMatch(/css\|js\)[\s\S]*?max-age=3600[\s\S]*?must-revalidate/);
  });

  it("CSS/JS have 1-hour max-age", () => {
    expect(nginxConf).toMatch(/css\|js\)[\s\S]*?max-age=3600/);
  });

  it("images have 30-day cache", () => {
    expect(nginxConf).toMatch(/svg\|png[\s\S]*?max-age=2592000/);
  });

  it("HTML has no-cache and no-store", () => {
    expect(nginxConf).toMatch(/html\$[\s\S]*?no-cache[\s\S]*?no-store/);
  });

  it("fonts have 7-day cache", () => {
    // Matches: location ~* \.(woff2?|ttf|otf|eot)$ { ... max-age=604800 }
    expect(nginxConf).toMatch(/woff2\?\|ttf\|otf\|eot[\s\S]*?max-age=604800/);
  });

  it("JSON has 5-minute cache", () => {
    expect(nginxConf).toMatch(/json\$[\s\S]*?max-age=300/);
  });

  it("sendfile is off (required for Termux/Android)", () => {
    expect(nginxConf).toMatch(/sendfile\s+off\s*;/);
  });
});
