#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Build the Vite app
npm run build
