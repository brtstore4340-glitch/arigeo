#!/bin/bash
# Auto-update PROJECT-REGISTRY-METRICS.md on commits
# Run after each commit that modifies registry files

REGISTRY_DIR="$(git rev-parse --show-toplevel)/.registry"
METRICS_FILE="$REGISTRY_DIR/PROJECT-REGISTRY-METRICS.md"

# Count projects with registry files
PROJECT_ROOT="$(git rev-parse --show-toplevel)/.."
TOTAL_PROJECTS=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*-oracle" -o -name "*-arigeo" | wc -l)
WITH_PROJECT_MD=$(find "$PROJECT_ROOT" -maxdepth 2 -name "PROJECT.md" -type f | wc -l)
WITH_ARCH=$(find "$PROJECT_ROOT" -maxdepth 2 -name "architecture.md" -type f | wc -l)
WITH_REQ=$(find "$PROJECT_ROOT" -maxdepth 2 -name "REQUIREMENTS.md" -type f | wc -l)
WITH_JSON=$(find "$PROJECT_ROOT" -maxdepth 2 -path "*/.registry/project.json" | wc -l)

# Update timestamp in metrics file
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" | sed 's/Z/GMT+7/')

echo "📊 Registry Metrics Updated"
echo "  Total projects: $TOTAL_PROJECTS"
echo "  With PROJECT.md: $WITH_PROJECT_MD"
echo "  With architecture.md: $WITH_ARCH"
echo "  With REQUIREMENTS.md: $WITH_REQ"
echo "  With .registry/project.json: $WITH_JSON"
echo ""
echo "Last auto-update: $TIMESTAMP"

# Note: Actual metrics update would require parsing and updating MARKDOWN/JSON
# This is a placeholder for the automation framework
