#!/bin/bash

# Clean Next.js cache and build artifacts
echo "Cleaning Next.js cache and build artifacts..."

rm -rf .next
rm -rf node_modules/.cache
rm -rf dist
rm -rf out

echo "Cache cleanup complete!"
echo "Run 'npm run dev' to start the dev server with a fresh cache."
