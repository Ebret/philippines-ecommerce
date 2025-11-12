# VPS Route Handler Fixes - Next.js 16 Compatibility

**Date:** November 10, 2025  
**Issue:** Route handlers using old parameter types  
**Solution:** Update to use `Promise<{ ... }>` for params

---

## 🔧 **FIX 1: addresses/[id]/route.ts**

### **Location:**
```
/var/www/html/ecom/app/src/app/api/addresses/[id]/route.ts
```

### **Find and Replace Pattern:**

**FIND:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
```

**REPLACE WITH:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
```

### **Then Replace All `params.id` with `id`:**
```bash
sed -i 's/params\.id/id/g' src/app/api/addresses/[id]/route.ts
```

---

## 🔧 **FIX 2: products/[id]/route.ts**

### **Location:**
```
/var/www/html/ecom/app/src/app/api/products/[id]/route.ts
```

### **Find and Replace Pattern:**

**FIND:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductWithRelations(params.id);
```

**REPLACE WITH:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductWithRelations(id);
```

### **Then Replace All `params.id` with `id`:**
```bash
sed -i 's/params\.id/id/g' src/app/api/products/[id]/route.ts
```

---

## 🔧 **FIX 3: categories/[id]/route.ts**

### **Location:**
```
/var/www/html/ecom/app/src/app/api/categories/[id]/route.ts
```

### **Find and Replace Pattern:**

**FIND:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
```

**REPLACE WITH:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
```

### **Then Replace All `params.id` with `id`:**
```bash
sed -i 's/params\.id/id/g' src/app/api/categories/[id]/route.ts
```

---

## 🚀 **AUTOMATED FIX SCRIPT**

Run this on your VPS to fix all route handlers:

```bash
#!/bin/bash

cd /var/www/html/ecom/app

echo "🔧 Fixing route handlers for Next.js 16..."

# Fix addresses route
echo "Fixing addresses/[id]/route.ts..."
sed -i 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' src/app/api/addresses/[id]/route.ts
sed -i 's/params\.id/id/g' src/app/api/addresses/[id]/route.ts

# Fix products route
echo "Fixing products/[id]/route.ts..."
sed -i 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' src/app/api/products/[id]/route.ts
sed -i 's/params\.id/id/g' src/app/api/products/[id]/route.ts

# Fix categories route
echo "Fixing categories/[id]/route.ts..."
sed -i 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' src/app/api/categories/[id]/route.ts
sed -i 's/params\.id/id/g' src/app/api/categories/[id]/route.ts

echo "✅ Route handler fixes complete!"
```

---

## 📋 **MANUAL FIX STEPS**

If you prefer to fix manually:

### **Step 1: Edit addresses/[id]/route.ts**
```bash
nano src/app/api/addresses/[id]/route.ts
```

Find these lines:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
```

Change to:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
```

Then find all `params.id` and replace with `id`.

### **Step 2: Edit products/[id]/route.ts**
```bash
nano src/app/api/products/[id]/route.ts
```

Same changes as above.

### **Step 3: Edit categories/[id]/route.ts**
```bash
nano src/app/api/categories/[id]/route.ts
```

Same changes as above.

---

## ✅ **VERIFICATION**

After applying fixes, verify the changes:

```bash
# Check addresses route
grep "params: Promise" src/app/api/addresses/[id]/route.ts

# Check products route
grep "params: Promise" src/app/api/products/[id]/route.ts

# Check categories route
grep "params: Promise" src/app/api/categories/[id]/route.ts
```

**Expected Output:**
```
{ params }: { params: Promise<{ id: string }> }
```

---

## 🔨 **REBUILD AFTER FIXES**

```bash
# Clean build
rm -f .next/lock
rm -rf .next

# Rebuild
npm run build

# Start with PM2
pm2 start npm --name "philippines-ecommerce" -- start

# Verify
sleep 5
pm2 status
pm2 logs philippines-ecommerce --lines 20
```

---

## 🎯 **WHAT THESE FIXES DO**

### **Before (Broken):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;  // ❌ params is not a Promise
}
```

### **After (Fixed):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ✅ Await the Promise
}
```

---

## 📊 **FILES AFFECTED**

| File | Status |
|------|--------|
| `src/app/api/addresses/[id]/route.ts` | ⚠️ NEEDS FIX |
| `src/app/api/products/[id]/route.ts` | ⚠️ NEEDS FIX |
| `src/app/api/categories/[id]/route.ts` | ⚠️ NEEDS FIX |

---

**Last Updated:** November 10, 2025

