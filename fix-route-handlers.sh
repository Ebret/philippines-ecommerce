#!/bin/bash

# Philippines E-Commerce Platform - Fix Route Handlers for Next.js 16
# This script updates all route handlers to use Promise<{ ... }> for params

set -e

echo "🔧 Fixing Route Handlers for Next.js 16..."
echo ""

# Navigate to app directory
cd /var/www/html/ecom/app

# Function to fix a route file
fix_route_file() {
    local file=$1
    local param_name=$2
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    echo "Fixing: $file"
    
    # Check if file already has Promise<{ ... }>
    if grep -q "params: Promise<" "$file"; then
        echo "  ✓ Already fixed"
        return
    fi
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Replace the pattern
    sed -i "s/{ params }: { params: { \([^}]*\) } }/{ params }: { params: Promise<{ \1 }> }/g" "$file"
    
    # Add await params where needed
    if grep -q "params: Promise<" "$file"; then
        # Add const { ... } = await params; after try block
        sed -i '/^  try {$/a\    const { '"$param_name"' } = await params;' "$file"
        
        # Replace params.id with just id
        sed -i "s/params\.$param_name/$param_name/g" "$file"
        
        echo "  ✓ Fixed"
    fi
}

# Fix all route files with [id] parameter
echo "📝 Fixing route files with [id] parameter..."
echo ""

# Find all route files with [id] in the path
find src/app/api -name "route.ts" -path "*\[id\]*" | while read file; do
    fix_route_file "$file" "id"
done

# Find all route files with [variantId] in the path
find src/app/api -name "route.ts" -path "*\[variantId\]*" | while read file; do
    fix_route_file "$file" "variantId"
done

# Find all route files with [imageId] in the path
find src/app/api -name "route.ts" -path "*\[imageId\]*" | while read file; do
    fix_route_file "$file" "imageId"
done

# Find all route files with [orderId] in the path
find src/app/api -name "route.ts" -path "*\[orderId\]*" | while read file; do
    fix_route_file "$file" "orderId"
done

# Find all route files with [productId] in the path
find src/app/api -name "route.ts" -path "*\[productId\]*" | while read file; do
    fix_route_file "$file" "productId"
done

echo ""
echo "✅ Route handler fixes complete!"
echo ""
echo "Next steps:"
echo "1. npm run build"
echo "2. pm2 start npm --name 'philippines-ecommerce' -- start"
echo "3. pm2 logs philippines-ecommerce"

