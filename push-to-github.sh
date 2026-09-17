#!/usr/bin/env bash
# Autonomous script to stage, commit, and push all updates directly to Dhruv-Savaliya/Portfolio
set -euo pipefail

# Auto-load GITHUB_TOKEN from .env or .env.local if present
if [ -f .env ]; then
  export $(grep -E '^GITHUB_TOKEN=' .env | xargs) 2>/dev/null || true
fi
if [ -f .env.local ]; then
  export $(grep -E '^GITHUB_TOKEN=' .env.local | xargs) 2>/dev/null || true
fi

TOKEN="${1:-${GITHUB_TOKEN:-}}"

echo "=========================================================="
echo "  DHRUV SAVALIYA // PORTFOLIO AUTONOMOUS GITHUB PUSH"
echo "=========================================================="

# Configure Git User
git config user.name "Dhruv Savaliya"
git config user.email "dhruvsavaliya075@gmail.com"

# Stage all files
git add -A

# Check for staged changes and commit if needed
if ! git diff --staged --quiet; then
  COMMIT_MSG="feat: update portfolio components, responsive 3D core, and production build"
  git commit -m "$COMMIT_MSG"
  echo "==> Staged changes committed: $COMMIT_MSG"
else
  echo "==> Working tree clean. Ready to sync commits."
fi

# Check if authenticated push can proceed
if [ -n "$TOKEN" ]; then
  echo "==> Authenticating remote with GitHub token..."
  git remote set-url origin "https://Dhruv-Savaliya:${TOKEN}@github.com/Dhruv-Savaliya/Portfolio.git"
  echo "==> Pushing commits to origin/main..."
  git push origin main
  # Reset remote url to clean public url
  git remote set-url origin "https://github.com/Dhruv-Savaliya/Portfolio.git"
  echo ""
  echo "=========================================================="
  echo "  SUCCESS: COMMITS PUSHED AUTONOMOUSLY TO GITHUB!"
  echo "  Vercel production deployment initiated on main."
  echo "=========================================================="
else
  echo ""
  echo "=========================================================="
  echo "  STATUS: LOCAL COMMITS READY (AHEAD OF ORIGIN/MAIN)"
  echo ""
  echo "  GitHub authentication is required to push to remote:"
  echo "  Option 1: Run with token:"
  echo "    ./push-to-github.sh <YOUR_GITHUB_TOKEN>"
  echo "  Option 2: Export token:"
  echo "    export GITHUB_TOKEN=ghp_... && ./push-to-github.sh"
  echo "  Option 3: Save to .env (git-ignored):"
  echo "    echo 'GITHUB_TOKEN=ghp_...' >> .env"
  echo "=========================================================="
fi
