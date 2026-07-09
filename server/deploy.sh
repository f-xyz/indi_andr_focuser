#!/usr/bin/env bash
set -euo pipefail

REMOTE="andr@192.168.88.32"
REMOTE_DIR="/home/andr/indi_andr_focuser"
BUILD_DIR="build"

echo "Building..."
npx tsc
cp package.json package-lock.json build/

echo "Deploying..."
tar -C "$BUILD_DIR" -cf - . | \
ssh -T "$REMOTE" "mkdir -p '$REMOTE_DIR' && tar -C '$REMOTE_DIR' -xf -"

echo "Done."
