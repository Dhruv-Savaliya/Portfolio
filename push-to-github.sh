#!/usr/bin/env bash
# Autonomous script to stage, commit, and push all updates directly to Dhruv-Savaliya/Portfolio
set -euo pipefail

echo "=========================================================="
echo "  DHRUV SAVALIYA // PORTFOLIO AUTONOMOUS GITHUB PUSH"
echo "=========================================================="

TOKEN="${1:-${GITHUB_TOKEN:-}}"

if [ -z "$TOKEN" ]; then
  echo "Usage:"
  echo "  ./push-to-github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>"
  echo "  or export GITHUB_TOKEN=ghp_... and run ./push-to-github.sh"
  echo ""
  echo "Current status: Staging and creating local commit..."
fi

# Configure Git User
git config user.name "Dhruv Savaliya"
git config user.email "dhruvsavaliya075@gmail.com"

# Stage all files
git add -A

# Check for staged changes
if git diff --staged --quiet; then
  echo "==> No unstaged changes detected. Working tree is clean."
else
  COMMIT_MSG="feat: complete cinematic glassmorphism portfolio with responsive 3D core, dark/light theme, and vercel deployment"
  git commit -m "$COMMIT_MSG"
  echo "==> Successfully committed: $COMMIT_MSG"
fi

# If token provided, set authenticated remote and push
if [ -n "$TOKEN" ]; then
  echo "==> Authenticating remote with provided token..."
  git remote set-url origin "https://Dhruv-Savaliya:${TOKEN}@github.com/Dhruv-Savaliya/Portfolio.git"
  echo "==> Pushing to origin/main..."
  git push origin main
  # Reset remote url to avoid leaking token in config
  git remote set-url origin "https://github.com/Dhruv-Savaliya/Portfolio.git"
  echo "==> PUSH COMPLETED SUCCESSFULLY TO GITHUB!"
  echo "==> Vercel auto-deployment triggered on main branch."
else
  echo ""
  echo "=========================================================="
  echo "  LOCAL COMMIT CREATED SUCCESSFULLY!"
  echo "  To push to GitHub, run:"
  echo "  ./push-to-github.sh <YOUR_GITHUB_TOKEN>"
  echo "=========================================================="
fi
