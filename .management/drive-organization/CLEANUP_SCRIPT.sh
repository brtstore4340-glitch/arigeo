#!/bin/bash

# D: Drive Cleanup & Organization Script
# Created: 2026-06-24
# Manager: Codex Oracle
# WARNING: Run this with care!

set -e

echo "╔════════════════════════════════════════╗"
echo "║  D: Drive Cleanup & Organization       ║"
echo "║  Codex Oracle · Silent Cartographer    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then
  echo "⚠️  WARNING: Running as root. This is not recommended."
  echo "Continue? (yes/no)"
  read -r confirm
  if [ "$confirm" != "yes" ]; then
    echo "Aborting."
    exit 1
  fi
fi

cd /mnt/d || exit 1

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Select operation:"
echo ""
echo "1. DRY RUN - Show what would be done"
echo "2. DELETE DUPLICATES - Remove 01 Main Work variants"
echo "3. MOVE ARCHIVE - Move Archive folder to 03-ARCHIVE"
echo "4. ORGANIZE EXPERIMENTAL - Move OllamaApp to 04-EXPERIMENTAL"
echo "5. SECURITY REVIEW - Check for secrets in API Firebase"
echo "6. FULL CLEANUP - All of the above (careful!)"
echo "7. EXIT"
echo ""
read -p "Choose (1-7): " choice

case $choice in
  1)
    echo "DRY RUN MODE - No changes will be made"
    echo ""
    echo "Would delete:"
    ls -la | grep "01" | grep -v "01 Main"
    echo ""
    echo "Would move to 03-ARCHIVE:"
    ls -la Archive/
    ;;

  2)
    echo "Removing duplicate folder variants..."
    if [ -d "01%20Main%20Work" ]; then
      echo "Moving 01%20Main%20Work to backup..."
      mv "01%20Main%20Work" ".backup-01-urlencoded"
      echo "✅ Moved"
    fi
    if [ -d "01-Main Work" ]; then
      echo "Moving 01-Main Work to backup..."
      mv "01-Main Work" ".backup-01-hyphen-space"
      echo "✅ Moved"
    fi
    if [ -d "01-Main-Work" ]; then
      echo "Moving 01-Main-Work to backup..."
      mv "01-Main-Work" ".backup-01-all-hyphens"
      echo "✅ Moved"
    fi
    echo ""
    echo "✅ Duplicates backed up (can be deleted if verified)"
    ;;

  3)
    if [ -d "Archive" ]; then
      echo "Moving Archive to 03-ARCHIVE..."
      cp -r Archive/* 03-ARCHIVE/ 2>/dev/null || true
      mv Archive .backup-Archive
      echo "✅ Moved (original backed up as .backup-Archive)"
    fi
    ;;

  4)
    if [ -d "OllamaApp" ]; then
      echo "Moving OllamaApp to 04-EXPERIMENTAL..."
      mv OllamaApp 04-EXPERIMENTAL/
      echo "✅ Moved"
    fi
    ;;

  5)
    echo "Scanning for potential secrets in API Firebase..."
    if [ -d "API Firebase" ]; then
      grep -r -i "password\|api_key\|secret\|token\|credentials" "API Firebase/" 2>/dev/null > /tmp/api-secrets.txt || true
      count=$(wc -l < /tmp/api-secrets.txt)
      echo ""
      echo "Found $count potential secrets:"
      cat /tmp/api-secrets.txt | head -20
      echo ""
      echo "Full report: /tmp/api-secrets.txt"
      echo ""
      echo "⚠️  REVIEW BEFORE SHARING THIS FOLDER"
    fi
    ;;

  6)
    echo ""
    echo "🚨 FULL CLEANUP MODE 🚨"
    echo "This will perform ALL cleanup operations."
    echo ""
    read -p "Are you sure? Type 'cleanup-all' to confirm: " confirm
    if [ "$confirm" = "cleanup-all" ]; then
      echo "Starting full cleanup..."

      # Delete duplicates
      echo "Removing duplicates..."
      [ -d "01%20Main%20Work" ] && mv "01%20Main%20Work" ".backup-01-urlencoded"
      [ -d "01-Main Work" ] && mv "01-Main Work" ".backup-01-hyphen-space"
      [ -d "01-Main-Work" ] && mv "01-Main-Work" ".backup-01-all-hyphens"
      echo "✅ Duplicates backed up"

      # Move archive
      echo "Moving Archive..."
      [ -d "Archive" ] && cp -r Archive/* 03-ARCHIVE/ 2>/dev/null && mv Archive .backup-Archive
      echo "✅ Archive moved"

      # Move experimental
      echo "Moving experimental..."
      [ -d "OllamaApp" ] && mv OllamaApp 04-EXPERIMENTAL/
      echo "✅ Experimental moved"

      # Security review
      echo "Scanning for secrets..."
      [ -d "API Firebase" ] && grep -r -i "password\|api_key\|secret\|token" "API Firebase/" > /tmp/api-secrets.txt 2>/dev/null || true
      echo "✅ Secrets scanned (check /tmp/api-secrets.txt)"

      echo ""
      echo "╔════════════════════════════════════════╗"
      echo "║  ✅ CLEANUP COMPLETE                   ║"
      echo "╚════════════════════════════════════════╝"
      echo ""
      echo "Summary:"
      echo "- Duplicates: Backed up (safe to delete)"
      echo "- Archive: Moved to 03-ARCHIVE/"
      echo "- Experimental: Moved to 04-EXPERIMENTAL/"
      echo "- Secrets: Scanned to /tmp/api-secrets.txt"
      echo ""
      echo "Next: Review /tmp/api-secrets.txt for API Firebase"
    else
      echo "Cancelled."
    fi
    ;;

  7)
    echo "Exiting."
    exit 0
    ;;

  *)
    echo "Invalid choice."
    exit 1
    ;;
esac

echo ""
echo "Done. Review changes and verify everything looks good."
