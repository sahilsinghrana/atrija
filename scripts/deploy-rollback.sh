#!/bin/bash
# deploy-rollback.sh — Backup current dist and restore on deploy failure
# Usage: ./deploy-rollback.sh backup|restore|status

DEPLOY_DIR="/var/www/html"
BACKUP_DIR="/tmp/van-gogh-last-good-dist"

case "$1" in
  backup)
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR"/* "$BACKUP_DIR/" 2>/dev/null
    echo "BACKUP_OK: $(du -sh "$BACKUP_DIR" | cut -f1)"
    ;;

  restore)
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
      echo "RESTORE_FAIL: No backup found at $BACKUP_DIR"
      echo "FIX: git checkout -- . && npm run build && cp -r dist/* $DEPLOY_DIR/"
      exit 1
    fi
    rm -rf "${DEPLOY_DIR:?}"/*
    cp -r "$BACKUP_DIR"/* "$DEPLOY_DIR/"
    # Restart nginx (Cybertron VFS page cache)
    fuser -k 8080/tcp 2>/dev/null; sleep 1; nginx 2>&1 | head -3
    echo "RESTORE_OK: Rolled back to last known-good deploy"
    echo "VERIFY: curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/"
    ;;

  status)
    if [ -d "$BACKUP_DIR" ] && [ -n "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
      echo "BACKUP_EXISTS: $(du -sh "$BACKUP_DIR" | cut -f1), $(stat -c %Y "$BACKUP_DIR") epoch"
    else
      echo "NO_BACKUP"
    fi
    ;;

  *)
    echo "Usage: $0 {backup|restore|status}"
    exit 1
    ;;
esac
