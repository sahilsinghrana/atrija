#!/bin/bash
# scripts/kanban-generate.sh — Generate new ideas and move tasks through TDD pipeline
# Called by cron to autonomously populate kanban and trigger implementation

set -e

PROJECT_DIR="/root/projects/van-gogh-site"
KANBAN_FILE="$PROJECT_DIR/.hermes/kanban.json"

echo "[kanban-generate] Starting idea generation cycle..."

# Use hermes to generate a new idea and create a failing test
cd "$PROJECT_DIR"

# Pick a random category
CATEGORIES=("3D Elements" "Interactivity" "Shaders" "Audio" "UI" "Content" "Performance")
CATEGORY=${CATEGORIES[$RANDOM % ${#CATEGORIES[@]}]}

echo "[kanban-generate] Selected category: $CATEGORY"

# Generate idea using hermes agent
IDEA=$(hermes agent --profile kanban --prompt "Generate one creative feature idea for the Van Gogh impressionist website. Category: $CATEGORY. The idea should be specific, implementable, and align with the artistic/philosophical theme. Output ONLY a JSON object with fields: title (string), description (string), priority (high/medium/low). No markdown, no explanation." 2>/dev/null || echo "")

if [ -n "$IDEA" ]; then
  echo "[kanban-generate] Generated idea: $IDEA"
  
  # Add to kanban via node script
  node -e "
    const fs = require('fs');
    const kanban = JSON.parse(fs.readFileSync('$KANBAN_FILE', 'utf-8'));
    const idea = $IDEA;
    const id = 'idea-' + Date.now();
    kanban.ideas.push({ id, ...idea, category: '$CATEGORY', status: 'backlog', generatedAt: new Date().toISOString() });
    fs.writeFileSync('$KANBAN_FILE', JSON.stringify(kanban, null, 2));
    console.log('[kanban-generate] Added idea:', id);
  "
else
  echo "[kanban-generate] No idea generated, skipping..."
fi

# Check if any ideas in backlog should move to Red (TDD)
BACKLOG_COUNT=$(node -e "
  const fs = require('fs');
  const kanban = JSON.parse(fs.readFileSync('$KANBAN_FILE', 'utf-8'));
  const backlog = kanban.ideas.filter(i => i.status === 'backlog');
  console.log(backlog.length);
")

if [ "$BACKLOG_COUNT" -gt 0 ]; then
  echo "[kanban-generate] $BACKLOG_COUNT ideas in backlog. Moving highest priority to Red..."
  
  node -e "
    const fs = require('fs');
    const kanban = JSON.parse(fs.readFileSync('$KANBAN_FILE', 'utf-8'));
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const backlog = kanban.ideas.filter(i => i.status === 'backlog');
    backlog.sort((a, b) => (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1));
    if (backlog.length > 0) {
      backlog[0].status = 'red';
      fs.writeFileSync('$KANBAN_FILE', JSON.stringify(kanban, null, 2));
      console.log('[kanban-generate] Moved to Red:', backlog[0].id, '-', backlog[0].title);
    }
  "
fi

echo "[kanban-generate] Cycle complete."
