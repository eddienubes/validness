#!/bin/bash

PACKAGE_JSON="package.json"

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to run this script."
    exit 1
fi

# Remove "type": "module" from package.json
jq 'del(.type)' "$PACKAGE_JSON" > temp.json && mv temp.json "$PACKAGE_JSON"

echo '"type": "module" has been removed from package.json.'