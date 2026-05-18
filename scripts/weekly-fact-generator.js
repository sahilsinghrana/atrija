// scripts/weekly-fact-generator.js
// INSTRUCTIONS FOR HERMES AGENT (weekly cron):
// 1. Read src/content/siteData.json
// 2. For each of the 5 themes (Moon, Ego, Bhagavad Gita, Shiv Purana, Art & Beauty):
//    a. Generate 2 NEW philosophy facts that are NOT already in the facts array
//    b. Each fact: 1-2 sentences, insightful, tied to the theme
//    c. Include source attribution (scripture, philosopher, or text)
//    d. Ensure diversity: historical, scientific, philosophical, cultural
// 3. Append new facts to each theme's facts array
// 4. Write updated src/content/siteData.json
// 5. Add changelog entry: type "content", description "Weekly facts: +10 new philosophy facts"
// 6. Build: cd /root/projects/van-gogh-site && npm run build
// 7. Deploy: BUILD_VERSION=$(date +%s) && sed -i "s/BUILD_VERSION/$BUILD_VERSION/g" dist/index.html && cp -r dist/* /data/data/com.termux/files/usr/share/nginx/html/
// 8. Git commit: feat: weekly philosophy facts — +10 new facts across 5 themes
// 9. Git push origin master

const fs = require('fs');
const path = require('path');

const siteDataPath = path.join(__dirname, '..', 'src', 'content', 'siteData.json');
const changelogDir = path.join(__dirname, '..', 'src', 'content', 'changelog');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJSON(p, d) { fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

function isDuplicate(newFact, existingFacts) {
  var newLower = newFact.toLowerCase().substring(0, 50);
  return existingFacts.some(function(f) {
    return f.toLowerCase().substring(0, 50) === newLower;
  });
}

module.exports = { readJSON, writeJSON, siteDataPath, changelogDir, isDuplicate };
