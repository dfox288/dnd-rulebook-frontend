#!/bin/bash
#
# Create an isolated Git worktree for parallel Claude Code agent work
#
# Usage:
#   ./scripts/create-agent-worktree.sh <instance-number> <branch-name>
#
# Examples:
#   ./scripts/create-agent-worktree.sh 1 feature/issue-130-race-subrace
#   ./scripts/create-agent-worktree.sh 2 feature/issue-131-languages
#
# This creates:
#   ../frontend-agent-<N>/  - Git worktree with isolated environment
#
# Port assignments:
#   Instance 1: Nuxt=4001, HMR=34679, Storybook=6007, Nginx=8082
#   Instance 2: Nuxt=4002, HMR=34680, Storybook=6008, Nginx=8083
#   Instance N: Nuxt=400N, HMR=3467(8+N), Storybook=600(6+N), Nginx=808(1+N)

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
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo ""
    echo "Usage: $0 <instance-number> <branch-name>"
    echo ""
    echo "Examples:"
    echo "  $0 1 feature/issue-130-race-subrace"
    echo "  $0 2 feature/issue-131-languages"
    echo ""
    echo "Instance numbers and their ports:"
    echo "  1: Nuxt=4001, HMR=34679, Storybook=6007, Nginx=8082"
    echo "  2: Nuxt=4002, HMR=34680, Storybook=6008, Nginx=8083"
    echo "  3: Nuxt=4003, HMR=34681, Storybook=6009, Nginx=8084"
    exit 1
fi

INSTANCE_ID="$1"
BRANCH_NAME="$2"

# Validate instance number
if ! [[ "$INSTANCE_ID" =~ ^[1-9][0-9]*$ ]]; then
    echo -e "${RED}Error: Instance number must be a positive integer (got: $INSTANCE_ID)${NC}"
    exit 1
fi

# Calculate ports
NUXT_PORT=$((4000 + INSTANCE_ID))
HMR_PORT=$((34678 + INSTANCE_ID))
STORYBOOK_PORT=$((6006 + INSTANCE_ID))
NGINX_PORT=$((8081 + INSTANCE_ID))

WORKTREE_DIR="$PARENT_DIR/frontend-agent-$INSTANCE_ID"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Creating Agent Worktree Environment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Instance:    ${GREEN}$INSTANCE_ID${NC}"
echo -e "Branch:      ${GREEN}$BRANCH_NAME${NC}"
echo -e "Directory:   ${GREEN}$WORKTREE_DIR${NC}"
echo ""
echo -e "${YELLOW}Port assignments:${NC}"
echo -e "  Nuxt:      ${GREEN}$NUXT_PORT${NC}"
echo -e "  HMR:       ${GREEN}$HMR_PORT${NC}"
echo -e "  Storybook: ${GREEN}$STORYBOOK_PORT${NC}"
echo -e "  Nginx:     ${GREEN}$NGINX_PORT${NC}"
echo ""

# Check if worktree directory already exists
if [ -d "$WORKTREE_DIR" ]; then
    echo -e "${RED}Error: Directory already exists: $WORKTREE_DIR${NC}"
    echo ""
    echo "To remove an existing worktree, run:"
    echo "  ./scripts/remove-agent-worktree.sh $INSTANCE_ID"
    exit 1
fi

# Check if branch exists, create if not
cd "$PROJECT_ROOT"
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo -e "${GREEN}✓ Branch '$BRANCH_NAME' exists${NC}"
else
    echo -e "${YELLOW}Branch '$BRANCH_NAME' does not exist. Creating from current HEAD...${NC}"
    git branch "$BRANCH_NAME"
    echo -e "${GREEN}✓ Created branch '$BRANCH_NAME'${NC}"
fi

# Create worktree
echo ""
echo -e "${BLUE}Creating git worktree...${NC}"
git worktree add "$WORKTREE_DIR" "$BRANCH_NAME"
echo -e "${GREEN}✓ Worktree created${NC}"

# Generate docker-compose.override.yml from template
echo ""
echo -e "${BLUE}Generating docker-compose.override.yml...${NC}"
sed -e "s/{{INSTANCE_ID}}/$INSTANCE_ID/g" \
    -e "s/{{NUXT_PORT}}/$NUXT_PORT/g" \
    -e "s/{{HMR_PORT}}/$HMR_PORT/g" \
    -e "s/{{STORYBOOK_PORT}}/$STORYBOOK_PORT/g" \
    -e "s/{{NGINX_PORT}}/$NGINX_PORT/g" \
    "$PROJECT_ROOT/docker-compose.override.template.yml" > "$WORKTREE_DIR/docker-compose.override.yml"
echo -e "${GREEN}✓ Override file created${NC}"

# Create a convenience script to start the environment
cat > "$WORKTREE_DIR/start-env.sh" << 'STARTSCRIPT'
#!/bin/bash
# Start the Docker environment for this agent worktree
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
echo ""
echo "Environment started! Access at:"
grep -E "^\s+- \"[0-9]+:" docker-compose.override.yml | sed 's/.*"\([0-9]*\):.*/  http:\/\/localhost:\1/'
STARTSCRIPT
chmod +x "$WORKTREE_DIR/start-env.sh"

cat > "$WORKTREE_DIR/stop-env.sh" << 'STOPSCRIPT'
#!/bin/bash
# Stop the Docker environment for this agent worktree
docker compose -f docker-compose.yml -f docker-compose.override.yml down
echo "Environment stopped."
STOPSCRIPT
chmod +x "$WORKTREE_DIR/stop-env.sh"

cat > "$WORKTREE_DIR/run.sh" << 'RUNSCRIPT'
#!/bin/bash
# Run npm commands in the Docker container for this agent worktree
docker compose -f docker-compose.yml -f docker-compose.override.yml exec nuxt npm "$@"
RUNSCRIPT
chmod +x "$WORKTREE_DIR/run.sh"

echo -e "${GREEN}✓ Convenience scripts created${NC}"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Worktree Ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Directory: ${BLUE}$WORKTREE_DIR${NC}"
echo ""
echo -e "${YELLOW}Quick Start:${NC}"
echo ""
echo "  cd $WORKTREE_DIR"
echo "  ./start-env.sh              # Start Docker containers"
echo "  ./run.sh install            # Install dependencies"
echo "  ./run.sh dev                # Start dev server"
echo "  ./run.sh test               # Run tests"
echo "  ./stop-env.sh               # Stop containers"
echo ""
echo -e "${YELLOW}Or with docker compose directly:${NC}"
echo ""
echo "  docker compose -f docker-compose.yml -f docker-compose.override.yml up -d"
echo "  docker compose -f docker-compose.yml -f docker-compose.override.yml exec nuxt npm run dev"
echo ""
echo -e "${YELLOW}Access URLs:${NC}"
echo "  Nuxt:      http://localhost:$NUXT_PORT"
echo "  Nginx:     http://localhost:$NGINX_PORT"
echo "  Storybook: http://localhost:$STORYBOOK_PORT"
echo ""
echo -e "${YELLOW}To remove this worktree later:${NC}"
echo "  ./scripts/remove-agent-worktree.sh $INSTANCE_ID"
