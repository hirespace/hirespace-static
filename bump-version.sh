#!/usr/bin/env bash
bower version {$1}
npm version {$1}

git tag -a $1 -m "${2}"
git push --tags

printf "\n\n\nVersion has been bumped to {$1}\n\n"