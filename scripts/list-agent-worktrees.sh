#!/bin/bash
#
# List all active agent worktrees and their status
#
# Usage:
#   ./scripts/list-agent-worktrees.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$PROJECT_ROOT")"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Agent Worktree Environments${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# List git worktrees
cd "$PROJECT_ROOT"
WORKTREES=$(git worktree list --porcelain | grep "^worktree" | cut -d' ' -f2)

FOUND_AGENTS=0

while IFS= read -r worktree_path; do
    # Only show agent worktrees (frontend-agent-N directories)
    if [[ "$worktree_path" == *"frontend-agent-"* ]]; then
        FOUND_AGENTS=1

        # Extract instance number
        INSTANCE_ID=$(echo "$worktree_path" | grep -oE 'frontend-agent-[0-9]+' | grep -oE '[0-9]+')

        # Get branch name
        BRANCH=$(cd "$worktree_path" && git branch --show-current 2>/dev/null || echo "unknown")

        # Calculate ports
        NUXT_PORT=$((4000 + INSTANCE_ID))
        NGINX_PORT=$((8081 + INSTANCE_ID))

        # Check if containers are running
        CONTAINER_NAME="dnd-frontend-nuxt-$INSTANCE_ID"
        if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
            STATUS="${GREEN}● Running${NC}"
        else
            STATUS="${YELLOW}○ Stopped${NC}"
        fi

        echo -e "${CYAN}Agent $INSTANCE_ID${NC}"
        echo -e "  Path:   $worktree_path"
        echo -e "  Branch: $BRANCH"
        echo -e "  Status: $STATUS"
        echo -e "  URLs:   http://localhost:$NUXT_PORT (Nuxt) | http://localhost:$NGINX_PORT (Nginx)"
        echo ""
    fi
done <<< "$WORKTREES"

if [ $FOUND_AGENTS -eq 0 ]; then
    echo -e "${YELLOW}No agent worktrees found.${NC}"
    echo ""
    echo "Create one with:"
    echo "  ./scripts/create-agent-worktree.sh <instance-number> <branch-name>"
    echo ""
    echo "Example:"
    echo "  ./scripts/create-agent-worktree.sh 1 feature/issue-130-race-subrace"
fi

echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Main environment (port 4000):${NC}"
MAIN_CONTAINER="dnd-frontend-nuxt"
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${MAIN_CONTAINER}$"; then
    echo -e "  Status: ${GREEN}● Running${NC}"
else
    echo -e "  Status: ${YELLOW}○ Stopped${NC}"
fi
echo -e "  URLs:   http://localhost:4000 (Nuxt) | http://localhost:8081 (Nginx)"
