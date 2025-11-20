#!/bin/bash
# Helper script to execute commands in the Nuxt Docker container
# Usage: ./docker-exec.sh <command>
# Example: ./docker-exec.sh npm run dev

docker compose exec nuxt "$@"
