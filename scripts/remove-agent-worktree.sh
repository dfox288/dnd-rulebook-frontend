#!/bin/bash
#
# Remove an agent worktree and clean up Docker resources
#
# Usage:
#   ./scripts/remove-agent-worktree.sh <instance-number>
#
# Example:
#   ./scripts/remove-agent-worktree.sh 1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$PROJECT_ROOT")"

# Validate arguments
if [ $# -lt 1 ]; then
    echo -e "${RED}Error: Missing instance number${NC}"
    echo ""
    echo "Usage: $0 <instance-number>"
    echo ""
    echo "Example:"
    echo "  $0 1    # Removes frontend-agent-1"
    exit 1
fi

INSTANCE_ID="$1"
WORKTREE_DIR="$PARENT_DIR/frontend-agent-$INSTANCE_ID"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Removing Agent Worktree Environment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Instance:  ${YELLOW}$INSTANCE_ID${NC}"
echo -e "Directory: ${YELLOW}$WORKTREE_DIR${NC}"
echo ""

# Check if worktree directory exists
if [ ! -d "$WORKTREE_DIR" ]; then
    echo -e "${RED}Error: Worktree directory does not exist: $WORKTREE_DIR${NC}"
    exit 1
fi

# Stop Docker containers if running
echo -e "${BLUE}Stopping Docker containers...${NC}"
cd "$WORKTREE_DIR"
if [ -f "docker-compose.override.yml" ]; then
    docker compose -f docker-compose.yml -f docker-compose.override.yml down 2>/dev/null || true
    echo -e "${GREEN}✓ Containers stopped${NC}"
else
    echo -e "${YELLOW}⚠ No override file found, skipping container cleanup${NC}"
fi

# Remove the worktree
echo ""
echo -e "${BLUE}Removing git worktree...${NC}"
cd "$PROJECT_ROOT"
git worktree remove "$WORKTREE_DIR" --force
echo -e "${GREEN}✓ Worktree removed${NC}"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Cleanup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Removed: ${BLUE}$WORKTREE_DIR${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} The branch was NOT deleted. To delete the branch:"
echo "  git branch -d <branch-name>"
