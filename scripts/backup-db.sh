#!/usr/bin/env bash
# Database backup script for Atouts Services
# Usage: ./scripts/backup-db.sh [output_dir]
#
# Supports both DATABASE_URL and individual env vars.
# Reads from .env file if present.

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Load .env if it exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/atousservice_${TIMESTAMP}.sql.gz"

echo "Starting database backup..."

if [ -n "${DATABASE_URL:-}" ]; then
  echo "Using DATABASE_URL"
  pg_dump "$DATABASE_URL" --no-owner --no-acl | gzip > "$BACKUP_FILE"
else
  DB_HOST="${DATABASE_HOST:-localhost}"
  DB_PORT="${DATABASE_PORT:-5432}"
  DB_USER="${DATABASE_USER:-postgres}"
  DB_NAME="${DATABASE_NAME:-atousservice_db}"

  echo "Using individual vars: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
  PGPASSWORD="${DATABASE_PASSWORD:-}" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner --no-acl | gzip > "$BACKUP_FILE"
fi

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup complete: $BACKUP_FILE ($FILE_SIZE)"

# Clean up backups older than 30 days
DELETED=$(find "$BACKUP_DIR" -name "atousservice_*.sql.gz" -mtime +30 -delete -print | wc -l)
if [ "$DELETED" -gt 0 ]; then
  echo "Cleaned up $DELETED backup(s) older than 30 days"
fi
