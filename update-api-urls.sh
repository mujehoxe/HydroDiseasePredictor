#!/bin/bash

# This script updates all hardcoded API URLs in the source code to use the API_CONFIG

# Define the old URL pattern and the replacement
OLD_URL="https://vite-project-9cea.onrender.com/api/v1"
NEW_IMPORT="import API_CONFIG from './config/api';"
NEW_REFERENCE="\${API_CONFIG.BASE_URL}"

# Find all JS and JSX files in the src directory
find src -type f \( -name "*.js" -o -name "*.jsx" \) -print0 | while IFS= read -r -d '' file; do
    # Skip the config/api.js file itself and any node_modules
    if [[ "$file" == "src/config/api.js" || "$file" == *"node_modules"* ]]; then
        continue
    fi

    # Check if the file contains the old URL
    if grep -q "$OLD_URL" "$file"; then
        echo "Processing $file..."

        # Check if we need to add the import statement
        if ! grep -q "import API_CONFIG from './config/api';" "$file"; then
            # Find the last import statement and add ours after it
            sed -i.bak "$(grep -n "^import" "$file" | tail -1 | cut -d: -f1) a\\
$NEW_IMPORT" "$file"
        fi

        # Replace the hardcoded URL with the dynamic reference
        sed -i.bak "s|$OLD_URL|$NEW_REFERENCE|g" "$file"
        
        # Fix any double quotes issues with the replacement
        sed -i.bak "s|'$NEW_REFERENCE|'${NEW_REFERENCE}|g" "$file"
        sed -i.bak "s|$NEW_REFERENCE'|${NEW_REFERENCE}'|g" "$file"
        sed -i.bak "s|\"$NEW_REFERENCE|\"${NEW_REFERENCE}|g" "$file"
        sed -i.bak "s|$NEW_REFERENCE\"|${NEW_REFERENCE}\"|g" "$file"
        
        # Fix API path (remove duplicate slashes)
        sed -i.bak "s|${NEW_REFERENCE}/|${NEW_REFERENCE}|g" "$file"

        # Remove backup files
        rm "$file.bak"
    fi
done

echo "URL replacement complete!" 