#!/bin/sh

branch="$(git branch --show-current)"

if [[ ! "$branch" =~ ^(main|dev|feat/.+)$ ]]; then
  echo "❌ invalid branch name: $branch"
  echo ""
  echo "허용 브랜치:"
  echo "- main"
  echo "- dev"
  echo "- feat/*"
  echo "- chore/*"
  echo "- design/*"
  echo "- bug/*"
  echo "- docs/*"
  exit 1
fi
