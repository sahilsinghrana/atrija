// public/js/scene/scene-flowers.js
import { _seededRand } from "./scene-utils.js";

export function makeSunflowerCanvas(size) {
  size = size || 128;
  var c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  var ctx = c.getContext("2d");
  var cx = size / 2;
  var headCy = size * 0.35;
  var r = size * 0.28;

  // Clear to fully transparent
  ctx.clearRect(0, 0, size, size);

  ctx.strokeStyle = "#2d5a1e";
  ctx.lineWidth = size * 0.04;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, headCy + r * 0.8);
  ctx.bezierCurveTo(
    cx + size * 0.03,
    headCy + r * 1.5,
    cx - size * 0.02,
    headCy + r * 2.2,
    cx,
    size,
  );
  ctx.stroke();

  ctx.fillStyle = "#3a7a2e";
  for (var side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(cx + side * size * 0.02, headCy + r * 1.6);
    ctx.rotate(side * 0.4);
    ctx.beginPath();
    ctx.ellipse(
      side * size * 0.08,
      0,
      size * 0.1,
      size * 0.04,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }

  var petalCount = 18;
  ctx.fillStyle = "#c8920a";
  for (var i = 0; i < petalCount; i++) {
    var aAngle = (i / petalCount) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, headCy);
    ctx.rotate(aAngle);
    ctx.beginPath();
    ctx.ellipse(0, -(r * 0.75), r * 0.13, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = "#e8a020";
  for (var q = 0; q < petalCount; q++) {
    var aOffset = (q / petalCount) * Math.PI * 2 + (Math.PI / petalCount) * 0.5;
    ctx.save();
    ctx.translate(cx, headCy);
    ctx.rotate(aOffset);
    ctx.beginPath();
    ctx.ellipse(0, -(r * 0.68), r * 0.12, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  var grad = ctx.createRadialGradient(cx, headCy, 0, cx, headCy, r * 0.3);
  grad.addColorStop(0, "#3a1a00");
  grad.addColorStop(0.6, "#2a1200");
  grad.addColorStop(1, "#1a0a00");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, headCy, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5a3010";
  for (var s = 0; s < 20; s++) {
    var angle = s * 2.399963;
    var rad = r * 0.26 * Math.sqrt(s / 20);
    ctx.beginPath();
    ctx.arc(
      cx + Math.cos(angle) * rad,
      headCy + Math.sin(angle) * rad,
      size * 0.015,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  return c;
}

export function makeTulipStem(ctx, cx, size, stemTop, headCy, headR) {
  ctx.strokeStyle = "#2d5a1e";
  ctx.lineWidth = size * 0.018;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx, size * 0.95);
  ctx.bezierCurveTo(
    cx + size * 0.015,
    size * 0.8,
    cx - size * 0.01,
    size * 0.66,
    cx + size * 0.003,
    stemTop,
  );
  ctx.stroke();

  ctx.strokeStyle = "rgba(120,180,60,0.18)";
  ctx.lineWidth = size * 0.008;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.005, size * 0.93);
  ctx.bezierCurveTo(
    cx - size * 0.003,
    size * 0.79,
    cx - size * 0.006,
    size * 0.65,
    cx - size * 0.002,
    stemTop,
  );
  ctx.stroke();

  for (var side = -1; side <= 1; side += 2) {
    var leafBaseY = headCy + headR * 0.4;
    var leafTipY = leafBaseY + size * 0.15;
    var leafWidth = size * 0.05;

    ctx.save();
    var lg = ctx.createLinearGradient(
      cx,
      leafBaseY,
      cx + side * leafWidth,
      leafTipY,
    );
    lg.addColorStop(0, "#2d6a1e");
    lg.addColorStop(0.5, "#3a7a28");
    lg.addColorStop(1, "#4a8a30");
    ctx.fillStyle = lg;

    ctx.beginPath();
    ctx.moveTo(cx, leafBaseY);
    ctx.bezierCurveTo(
      cx + side * leafWidth,
      leafBaseY + size * 0.03,
      cx + side * leafWidth * 0.7,
      leafTipY - size * 0.03,
      cx + side * size * 0.003,
      leafTipY,
    );
    ctx.bezierCurveTo(
      cx - side * size * 0.002,
      leafTipY - size * 0.015,
      cx - side * size * 0.003,
      leafBaseY + size * 0.03,
      cx,
      leafBaseY,
    );
    ctx.fill();

    ctx.strokeStyle = "rgba(80,140,40,0.2)";
    ctx.lineWidth = size * 0.003;
    ctx.beginPath();
    ctx.moveTo(cx, leafBaseY + size * 0.008);
    ctx.quadraticCurveTo(
      cx + side * leafWidth * 0.4,
      (leafBaseY + leafTipY) * 0.5,
      cx + side * size * 0.003,
      leafTipY - size * 0.015,
    );
    ctx.stroke();
    ctx.restore();
  }
}

export function makeTulipCup(
  ctx,
  cx,
  size,
  stemTop,
  cupCY,
  cupW,
  cupH,
  color,
  openness,
  seed,
) {
  var rand = _seededRand(seed);
  var hex = color.replace("#", "");
  var rr = parseInt(hex.substring(0, 2), 16);
  var gg = parseInt(hex.substring(2, 4), 16);
  var bb = parseInt(hex.substring(4, 6), 16);
  var dR = Math.max(0, rr - 50);
  var dG = Math.max(0, gg - 40);
  var dB = Math.max(0, bb - 30);
  var lR = Math.min(255, rr + 40);
  var lG = Math.min(255, gg + 30);
  var lB = Math.min(255, bb + 20);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - cupW * 0.5, stemTop);
  ctx.bezierCurveTo(
    cx - cupW * 0.7,
    cupCY + cupH * 0.1,
    cx - cupW * 0.55,
    cupCY - cupH * 0.35,
    cx,
    cupCY - cupH * 0.55,
  );
  ctx.bezierCurveTo(
    cx + cupW * 0.55,
    cupCY - cupH * 0.35,
    cx + cupW * 0.7,
    cupCY + cupH * 0.1,
    cx + cupW * 0.5,
    stemTop,
  );
  ctx.closePath();
  var baseGrad = ctx.createLinearGradient(cx, stemTop, cx, cupCY - cupH * 0.55);
  baseGrad.addColorStop(
    0,
    "rgba(" +
      Math.round(rr * 0.8) +
      "," +
      Math.round(gg * 0.8) +
      "," +
      Math.round(bb * 0.8) +
      ",1)",
  );
  baseGrad.addColorStop(1, "rgba(" + lR + "," + lG + "," + lB + ",1)");
  ctx.fillStyle = baseGrad;
  ctx.fill();
  ctx.restore();

  for (var layer = 0; layer < 2; layer++) {
    for (var p = 0; p < 3; p++) {
      var angle = (p / 3) * Math.PI - Math.PI / 2 + (layer * Math.PI) / 3;
      var pcx = cx + Math.cos(angle) * cupW * 0.35;
      var pcy = cupCY + Math.sin(angle) * cupH * 0.25;
      var pw = cupW * (0.42 + rand() * 0.06);
      var ph = cupH * (0.5 + rand() * 0.08);
      ctx.save();
      ctx.translate(pcx, pcy);
      var tilt = ((pcx - cx) / cupW) * 0.3;
      ctx.rotate(tilt);
      ctx.beginPath();
      ctx.moveTo(0, ph * 0.35);
      ctx.bezierCurveTo(
        -pw * 0.8,
        ph * 0.2,
        -pw * 0.9,
        -ph * 0.25,
        -pw * 0.3,
        -ph * 0.45,
      );
      ctx.bezierCurveTo(
        -pw * 0.1,
        -ph * 0.55,
        pw * 0.1,
        -ph * 0.55,
        pw * 0.3,
        -ph * 0.45,
      );
      ctx.bezierCurveTo(pw * 0.9, -ph * 0.25, pw * 0.8, ph * 0.2, 0, ph * 0.35);
      ctx.closePath();
      var pg = ctx.createLinearGradient(0, -ph * 0.5, 0, ph * 0.35);
      if (layer === 0) {
        pg.addColorStop(
          0,
          "rgba(" +
            Math.round(rr * 0.85) +
            "," +
            Math.round(gg * 0.85) +
            "," +
            Math.round(bb * 0.85) +
            ",0.95)",
        );
        pg.addColorStop(
          0.5,
          "rgba(" +
            Math.round(rr * 0.75) +
            "," +
            Math.round(gg * 0.75) +
            "," +
            Math.round(bb * 0.75) +
            ",0.9)",
        );
        pg.addColorStop(1, "rgba(" + dR + "," + dG + "," + dB + ",0.85)");
      } else {
        pg.addColorStop(0, "rgba(" + lR + "," + lG + "," + lB + ",0.95)");
        pg.addColorStop(0.4, "rgba(" + rr + "," + gg + "," + bb + ",1)");
        pg.addColorStop(
          0.8,
          "rgba(" +
            Math.round(rr * 0.9) +
            "," +
            Math.round(gg * 0.9) +
            "," +
            Math.round(bb * 0.9) +
            ",0.95)",
        );
        pg.addColorStop(1, "rgba(" + dR + "," + dG + "," + dB + ",0.8)");
      }
      ctx.fillStyle = pg;
      ctx.fill();
      ctx.strokeStyle = "rgba(" + lR + "," + lG + "," + lB + ",0.15)";
      ctx.lineWidth = size * 0.004;
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    cx,
    cupCY - cupH * 0.05,
    cupW * 0.25,
    cupH * 0.12,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(20,40,10,0.25)";
  ctx.fill();
  ctx.restore();

  if (openness > 0.3) {
    for (var s = 0; s < 6; s++) {
      var sa = (s / 6) * Math.PI * 2;
      var sLen = cupH * (0.08 + rand() * 0.06);
      var shX = cx + Math.cos(sa) * cupW * 0.15;
      var shY = cupCY - cupH * 0.1;
      ctx.strokeStyle = "#5a7a3a";
      ctx.lineWidth = size * 0.005;
      ctx.beginPath();
      ctx.moveTo(shX, shY);
      ctx.lineTo(
        shX + Math.cos(sa) * sLen,
        shY - Math.abs(Math.sin(sa)) * sLen * 0.5,
      );
      ctx.stroke();
      ctx.fillStyle = "#c8a040";
      ctx.beginPath();
      ctx.arc(
        shX + Math.cos(sa) * sLen,
        shY - Math.abs(Math.sin(sa)) * sLen * 0.5,
        size * 0.008,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
}

export function makeTulipCanvas(size, color, openness, seed) {
  size = size || 256;
  openness = openness || 0.6;
  seed = seed || 42;
  var rand = _seededRand(seed);
  var c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  var ctx = c.getContext("2d");
  var cx = size / 2;

  // Clear to fully transparent
  ctx.clearRect(0, 0, size, size);

  // Parse color for shading
  var hex = color.replace("#", "");
  var rr = parseInt(hex.substring(0, 2), 16);
  var gg = parseInt(hex.substring(2, 4), 16);
  var bb = parseInt(hex.substring(4, 6), 16);

  // Layout: flower head in upper-middle, stem below, centered on canvas
  // Total flower+stem spans from headTop to stemBottom, centered at size*0.5
  var headHeight = size * 0.36;  // height of the tulip cup (flower head)
  var stemHeight = size * 0.30;  // visible stem below the cup
  var totalH = headHeight + stemHeight;
  var headCY = size * 0.5 - totalH * 0.18; // flower head center (slightly above middle)
  var cupTopY = headCY - headHeight * 0.5;
  var cupBaseY = headCY + headHeight * 0.4;
  var stemBottom = cupBaseY + stemHeight;

  var cupW = size * 0.10;
  var cupTopW = size * 0.11;
  var cupNeckY = cupBaseY - size * 0.04;
  var stemW = size * 0.018;

  // --- Stem ---
  ctx.strokeStyle = "#2d6a1e";
  ctx.lineWidth = stemW;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cupBaseY);
  ctx.quadraticCurveTo(cx + size * 0.008, (cupBaseY + stemBottom) * 0.5, cx, stemBottom);
  ctx.stroke();

  // --- Leaf left ---
  ctx.fillStyle = "#3a7a28";
  ctx.beginPath();
  ctx.moveTo(cx, cupBaseY + size * 0.04);
  ctx.bezierCurveTo(
    cx + size * 0.08, cupBaseY - size * 0.02,
    cx + size * 0.14, cupBaseY + size * 0.10,
    cx + size * 0.04, cupBaseY + size * 0.22,
  );
  ctx.quadraticCurveTo(cx - size * 0.02, cupBaseY + size * 0.14, cx, cupBaseY + size * 0.04);
  ctx.fill();

  // --- Leaf right ---
  ctx.fillStyle = "#2d6a1e";
  ctx.beginPath();
  ctx.moveTo(cx, cupBaseY + size * 0.08);
  ctx.bezierCurveTo(
    cx - size * 0.07, cupBaseY + size * 0.02,
    cx - size * 0.13, cupBaseY + size * 0.14,
    cx - size * 0.04, cupBaseY + size * 0.26,
  );
  ctx.quadraticCurveTo(cx + size * 0.02, cupBaseY + size * 0.18, cx, cupBaseY + size * 0.08);
  ctx.fill();

  // --- Tulip Flower (goblet shape, 3 petal tips) ---
  var petalTips = [
    { x: cx, y: cupTopY },
    { x: cx - cupTopW * 0.85, y: cupTopY + size * 0.025 },
    { x: cx + cupTopW * 0.85, y: cupTopY + size * 0.025 },
  ];

  var pR = Math.max(0, rr - 25);
  var pG = Math.max(0, gg - 20);
  var pB = Math.max(0, bb - 15);

  // Draw each petal
  for (var p = 0; p < 3; p++) {
    var tip = petalTips[p];
    var side = p === 0 ? 0 : (p === 1 ? -1 : 1);
    var topW = p === 0 ? cupTopW * 0.35 : cupTopW * 0.7;

    ctx.fillStyle = "rgb(" + rr + "," + gg + "," + bb + ")";
    ctx.beginPath();
    ctx.moveTo(cx - cupW * 0.35, cupBaseY);
    ctx.bezierCurveTo(
      cx - cupW * 0.5, cupNeckY,
      tip.x - topW * 0.6, tip.y + size * 0.04,
      tip.x, tip.y,
    );
    ctx.bezierCurveTo(
      tip.x + topW * 0.6, tip.y + size * 0.04,
      cx + cupW * 0.5, cupNeckY,
      cx + cupW * 0.35, cupBaseY,
    );
    ctx.closePath();
    ctx.fill();

    // Petal vein
    ctx.strokeStyle = "rgba(" + pR + "," + pG + "," + pB + ",0.35)";
    ctx.lineWidth = size * 0.004;
    ctx.beginPath();
    ctx.moveTo(cx + side * cupW * 0.1, cupBaseY - size * 0.02);
    ctx.quadraticCurveTo(
      cx + side * cupW * 0.15, cupNeckY,
      tip.x, tip.y + size * 0.02,
    );
    ctx.stroke();
  }

  // Petal edge highlights
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = size * 0.003;
  for (var e = 0; e < 3; e++) {
    var tip2 = petalTips[e];
    var s2 = e === 0 ? 0 : (e === 1 ? -1 : 1);
    var tw2 = e === 0 ? cupTopW * 0.35 : cupTopW * 0.7;
    ctx.beginPath();
    ctx.moveTo(cx, headCY - headHeight * 0.1);
    ctx.quadraticCurveTo(
      cx - s2 * cupW * 0.4, cupNeckY,
      tip2.x - s2 * tw2 * 0.3, tip2.y + size * 0.03,
    );
    ctx.stroke();
  }

  // --- Petal edge highlights (light catching the petal edges) ---
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = size * 0.003;
  for (var e = 0; e < 3; e++) {
    var tip = petalTips[e];
    var side = e === 0 ? 0 : (e === 1 ? -1 : 1);
    ctx.beginPath();
    ctx.moveTo(cx + side * cupW * 0.15, cupBaseY - size * 0.01);
    ctx.quadraticCurveTo(
      tip.x - side * cupTopW * 0.2, tip.y + size * 0.03,
      tip.x, tip.y + size * 0.01,
    );
    ctx.stroke();
  }

  // --- Inner petals (visible when open) ---
  if (openness > 0.4) {
    var innerR = Math.min(255, rr + 20);
    var innerG = Math.min(255, gg + 15);
    var innerB = Math.min(255, bb + 10);
    for (var ip = 0; ip < 3; ip++) {
      var iSide = ip === 0 ? 0 : (ip === 1 ? -1 : 1);
      var iTipX = cx + iSide * cupTopW * 0.35;
      var iTipY = cupTopY + size * 0.06;

      ctx.fillStyle = "rgba(" + innerR + "," + innerG + "," + innerB + ",0.85)";
      ctx.beginPath();
      ctx.moveTo(cx - cupW * 0.12, cupBaseY - size * 0.04);
      ctx.bezierCurveTo(
        cx - cupW * 0.15, cupNeckY,
        iTipX - cupTopW * 0.2, iTipY + size * 0.02,
        iTipX, iTipY,
      );
      ctx.bezierCurveTo(
        iTipX + cupTopW * 0.2, iTipY + size * 0.02,
        cx + cupW * 0.15, cupNeckY,
        cx + cupW * 0.12, cupBaseY - size * 0.04,
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  return c;
}

export function makeLilyCanvas(size, color, variant) {
  size = size || 160;
  var c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  var ctx = c.getContext("2d");
  var cx = size / 2;
  var headCy = size * 0.38;
  var headR = size * 0.24;

  var hexColor = color.replace("#", "");
  var rr = parseInt(hexColor.substring(0, 2), 16);
  var gg = parseInt(hexColor.substring(2, 4), 16);
  var bb = parseInt(hexColor.substring(4, 6), 16);

  ctx.strokeStyle = "#2d6a1e";
  ctx.lineWidth = size * 0.035;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx, headCy + headR * 0.7);
  ctx.bezierCurveTo(
    cx + size * 0.04,
    headCy + headR * 1.4,
    cx - size * 0.03,
    headCy + headR * 2.0,
    cx + size * 0.01,
    size,
  );
  ctx.stroke();

  ctx.fillStyle = "#3a7a2e";
  for (var side = -1; side <= 1; side += 2) {
    ctx.save();
    var lx = cx + side * size * 0.03;
    var ly = headCy + headR * 1.5;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.bezierCurveTo(
      lx + side * size * 0.14,
      ly - size * 0.04,
      lx + side * size * 0.18,
      ly - size * 0.12,
      lx + side * size * 0.1,
      ly - size * 0.18,
    );
    ctx.bezierCurveTo(
      lx + side * size * 0.06,
      ly - size * 0.14,
      lx + side * size * 0.03,
      ly - size * 0.08,
      lx,
      ly,
    );
    ctx.fill();
    ctx.restore();
  }

  var petalCount = 6;
  var spread = variant === 0 ? 0.05 : variant === 1 ? 0.15 : 0.3;
  for (var p = 0; p < petalCount; p++) {
    var angle = (p / petalCount) * Math.PI * 2 - Math.PI / 2;
    var pLightness = -2 + Math.floor(Math.random() * 5);
    var petalH =
      headR *
      (variant === 0 ? 1.1 : variant === 1 ? 0.8 : 0.7) *
      (0.9 + Math.random() * 0.2);
    var petalW =
      headR *
      (variant === 0 ? 0.18 : variant === 1 ? 0.25 : 0.32) *
      (0.85 + Math.random() * 0.3);
    var r2 = Math.min(255, Math.max(0, rr + pLightness * 8));
    var g2 = Math.min(255, Math.max(0, gg + pLightness * 4));
    var b2 = Math.min(255, Math.max(0, bb + pLightness * 2));

    ctx.save();
    ctx.translate(
      cx + Math.cos(angle) * spread * headR,
      headCy + Math.sin(angle) * spread * headR * 0.5,
    );
    ctx.rotate(
      angle + Math.PI / 2 + (variant === 0 ? 0.1 : variant === 1 ? 0.3 : 0.6),
    );

    var tipW = petalW * 1.3;
    ctx.beginPath();
    ctx.moveTo(0, petalH * 0.25);
    ctx.bezierCurveTo(
      -petalW * 0.4,
      petalH * 0.1,
      -tipW * 0.6,
      -petalH * 0.5,
      0,
      -petalH,
    );
    ctx.bezierCurveTo(
      tipW * 0.6,
      -petalH * 0.5,
      petalW * 0.4,
      petalH * 0.1,
      0,
      petalH * 0.25,
    );

    var pg = ctx.createLinearGradient(0, -petalH, 0, petalH * 0.3);
    pg.addColorStop(
      0,
      "rgba(" +
        Math.min(255, r2 + 40) +
        "," +
        Math.min(255, g2 + 10) +
        "," +
        Math.min(255, b2 + 10) +
        ",0.97)",
    );
    pg.addColorStop(0.4, "rgba(" + r2 + "," + g2 + "," + b2 + ",0.92)");
    pg.addColorStop(
      1,
      "rgba(" +
        Math.max(0, r2 - 50) +
        "," +
        Math.max(0, g2 - 30) +
        "," +
        Math.max(0, b2 - 20) +
        ",0.78)",
    );
    ctx.fillStyle = pg;
    ctx.fill();

    ctx.strokeStyle =
      "rgba(" +
      Math.max(0, r2 - 30) +
      "," +
      Math.max(0, g2 - 20) +
      "," +
      Math.max(0, b2 - 15) +
      ",0.15)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, petalH * 0.2);
    ctx.quadraticCurveTo(petalW * 0.05, 0, 0, -petalH * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  for (var s = 0; s < 6; s++) {
    var sa = (s / 6) * Math.PI * 2 - Math.PI / 2;
    var sLen = headR * (0.45 + Math.random() * 0.15);
    ctx.strokeStyle = "#5a7a3a";
    ctx.lineWidth = size * 0.012;
    ctx.beginPath();
    ctx.moveTo(cx, headCy);
    ctx.quadraticCurveTo(
      cx + Math.cos(sa) * sLen * 0.5,
      headCy + Math.sin(sa) * sLen * 0.5,
      cx + Math.cos(sa) * sLen,
      headCy + Math.sin(sa) * sLen,
    );
    ctx.stroke();
    var ax = cx + Math.cos(sa) * sLen;
    var ay = headCy + Math.sin(sa) * sLen;
    ctx.fillStyle = "#c8a040";
    ctx.beginPath();
    ctx.arc(ax, ay, size * 0.018, 0, Math.PI * 2);
    ctx.fill();
  }

  var pistilLen = headR * 0.65;
  ctx.strokeStyle = "#6a9a4a";
  ctx.lineWidth = size * 0.018;
  ctx.beginPath();
  ctx.moveTo(cx, headCy);
  ctx.lineTo(cx, headCy - pistilLen);
  ctx.stroke();
  ctx.fillStyle = "#7aaa5a";
  ctx.beginPath();
  ctx.arc(cx, headCy - pistilLen, size * 0.022, 0, Math.PI * 2);
  ctx.fill();

  for (var f = 0; f < 8; f++) {
    var fx = cx + (Math.random() - 0.5) * headR * 0.4;
    var fy = headCy + (Math.random() - 0.5) * headR * 0.4;
    ctx.fillStyle = "rgba(80, 40, 20, " + (0.2 + Math.random() * 0.3) + ")";
    ctx.beginPath();
    ctx.arc(fx, fy, size * (0.006 + Math.random() * 0.008), 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}
