// public/js/scene/scene-utils.js
export function getMoonPhase(date) {
  date = date || new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var a = Math.floor((14 - month) / 12);
  var y = year + 4800 - a;
  var m = month + 12 * a - 3;
  var jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  var daysSinceNew = jd - 2451549.5;
  var synodicMonth = 29.53058868;
  var phase = ((daysSinceNew % synodicMonth) + synodicMonth) % synodicMonth;
  var phaseFraction = phase / synodicMonth;
  return {
    phase: phase,
    fraction: phaseFraction,
    age: phase,
    illumination: (1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2,
  };
}

export function getMoonPhaseName(fraction) {
  if (fraction < 0.0625) return "New Moon";
  if (fraction < 0.1875) return "Waxing Crescent";
  if (fraction < 0.3125) return "First Quarter";
  if (fraction < 0.4375) return "Waxing Gibbous";
  if (fraction < 0.5625) return "Full Moon";
  if (fraction < 0.6875) return "Waning Gibbous";
  if (fraction < 0.8125) return "Last Quarter";
  if (fraction < 0.9375) return "Waning Crescent";
  return "New Moon";
}

export function getMoonEmoji(fraction) {
  if (fraction < 0.0625) return "\u{1F311}";
  if (fraction < 0.1875) return "\u{1F312}";
  if (fraction < 0.3125) return "\u{1F313}";
  if (fraction < 0.4375) return "\u{1F314}";
  if (fraction < 0.5625) return "\u{1F315}";
  if (fraction < 0.6875) return "\u{1F316}";
  if (fraction < 0.8125) return "\u{1F317}";
  if (fraction < 0.9375) return "\u{1F318}";
  return "\u{1F311}";
}

export function _seededRand(seed) {
  var s = seed;
  return function () {
    s = (s * 16807 + 7) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function closePathAsImplicit(ctx) {
  // Placeholder utility kept for compatibility.
}

export function saveConstellations(lines) {
  try {
    var data = [];
    for (var i = 0; i < lines.length; i++) {
      var positions = lines[i].geometry.attributes.position.array;
      data.push({
        x1: positions[0],
        y1: positions[1],
        z1: positions[2],
        x2: positions[3],
        y2: positions[4],
        z2: positions[5],
      });
    }
    localStorage.setItem("atrija-constellations", JSON.stringify(data));
  } catch (e) {}
}

export function loadConstellations() {
  try {
    return JSON.parse(localStorage.getItem("atrija-constellations") || "[]");
  } catch (e) {
    return [];
  }
}
