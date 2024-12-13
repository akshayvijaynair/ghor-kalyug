#!/bin/bash

# Exit on any error
set -e

# Define variables
CLIENT_DIR="client"
SERVER_DIR="server"

# Build the client
echo "Building client module..."
echo $CLIENT_DIR
cd $CLIENT_DIR
npm install
npm run build

# Deploy the client to App Engine
echo "Deploying client module to App Engine..."
gcloud app deploy
cd ..

# Build the server
echo "Building server module..."
cd "$SERVER_DIR"
npm install
npm run build

# Deploy the server to App Engine
echo "Deploying server module to App Engine..."
gcloud app deploy
cd ..

echo "Deployment complete!"
