# Test GinTea Theme Locally - Troubleshooting Guide

**Issue:** Theme colors not changing after deployment  
**Root Cause Analysis:** Need to verify colors work locally before deploying

---

## Step 1: Test Locally First

### **1.1 Start Development Server**

```bash
cd philippines-ecommerce
npm run dev
```

Wait for: `✓ Ready in X.Xs`  
Server will run on: http://localhost:3000

---

### **1.2 Open Browser DevTools**

1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Paste this code to check CSS variables:

```javascript
// Check if GinTea colors are loaded
const root = document.documentElement;
const styles = getComputedStyle(root);

console.log('=== GinTea Theme Color Check ===');
console.log('Background:', styles.getPropertyValue('--background'));
console.log('Foreground:', styles.getPropertyValue('--foreground'));
console.log('Primary:', styles.getPropertyValue('--primary'));
console.log('Secondary:', styles.getPropertyValue('--secondary'));
console.log('Accent:', styles.getPropertyValue('--accent'));
console.log('Mint:', styles.getPropertyValue('--mint'));
console.log('Chamomile:', styles.getPropertyValue('--chamomile'));

// Expected values:
// Background: hsl(45, 40%, 96%) - Soft Cream
// Foreground: hsl(150, 30%, 18%) - Deep Tea Leaf
// Primary: hsl(140, 40%, 35%) - Matcha Green
// Secondary: hsl(30, 35%, 40%) - Herbal Brown
// Accent: hsl(40, 80%, 55%) - Honey Gold
// Mint: hsl(160, 45%, 45%) - Fresh Mint
// Chamomile: hsl(50, 60%, 70%) - Chamomile Yellow
```

---

### **1.3 Visual Inspection**

**What to Look For:**

✅ **Background:** Should be soft cream `#FAF8F3` (not pure white)  
✅ **Text:** Should be deep tea leaf green `#213B2E` (not black)  
✅ **Primary Buttons:** Should be matcha green `#368A5C` (not dark forest green)  
✅ **Accent Elements:** Should be honey gold `#E8B84D` (not terracotta)

**If colors are WRONG:**
- Background is pure white → CSS not loaded
- Text is black → CSS variables not applied
- Buttons are dark green → Old colors still cached

---

## Step 2: Clear Build Cache

If colors are wrong locally, clear the build cache:

```bash
cd philippines-ecommerce
rm -rf .next
npm run build
npm run dev
```

Then refresh browser with **hard reload**: `Ctrl + Shift + R`

---

## Step 3: Inspect Element

1. Right-click on any element (e.g., a button)
2. Select **Inspect**
3. Look at **Computed** tab
4. Search for `background-color` or `color`
5. Check if it shows the new HSL values

**Example - Primary Button:**
- Should show: `rgb(54, 138, 92)` which is `#368A5C` (Matcha Green)
- If shows: `rgb(33, 74, 56)` which is `#214A38` (Old Forest Green) → Cache issue

---

## Step 4: Check globals.css is Loaded

In DevTools:
1. Go to **Sources** tab
2. Navigate to `localhost:3000` → `_next` → `static` → `css`
3. Open the CSS file
4. Search for `--primary:`
5. Verify it shows: `hsl(140, 40%, 35%)` (Matcha Green)

**If it shows old value `hsl(145, 35%, 20%)`:**
- Build didn't pick up changes
- Need to rebuild

---

## Step 5: Test Dark Mode

1. Click the theme toggle (moon/sun icon)
2. Background should change to deep tea room green `#131F1A`
3. Text should change to soft cream `#EDE8DC`
4. Primary should be bright matcha `#45B373`

**Check Dark Mode CSS Variables:**

```javascript
// Toggle to dark mode first, then run:
const html = document.documentElement;
html.classList.add('dark');

const styles = getComputedStyle(html);
console.log('=== Dark Mode Check ===');
console.log('Background:', styles.getPropertyValue('--background'));
console.log('Primary:', styles.getPropertyValue('--primary'));
console.log('Accent:', styles.getPropertyValue('--accent'));

// Expected:
// Background: hsl(150, 25%, 10%) - Deep Tea Room
// Primary: hsl(140, 45%, 50%) - Bright Matcha
// Accent: hsl(40, 75%, 65%) - Golden Honey
```

---

## Step 6: Production Build Test

Test the production build locally:

```bash
cd philippines-ecommerce
npm run build
npm start
```

Open http://localhost:3000 and verify colors.

**If colors work in dev but not in production build:**
- Tailwind CSS purging issue
- CSS variables not being included in build

---

## Common Issues & Solutions

### **Issue 1: Colors Don't Change**

**Cause:** Browser cache or build cache  
**Solution:**
```bash
# Clear build
rm -rf .next

# Clear browser cache
Ctrl + Shift + Delete → Clear cache

# Rebuild
npm run build
npm run dev
```

---

### **Issue 2: Some Colors Change, Others Don't**

**Cause:** Components using hardcoded colors instead of CSS variables  
**Solution:** Check component files for hardcoded hex colors

```bash
# Search for hardcoded colors
grep -r "#214A38" src/
grep -r "#DF6B1F" src/
```

If found, replace with Tailwind classes:
- `#214A38` → `bg-primary` or `text-primary`
- `#DF6B1F` → `bg-accent` or `text-accent`

---

### **Issue 3: Dark Mode Doesn't Work**

**Cause:** Dark mode toggle not working or CSS not applied  
**Solution:**

1. Check if `html.dark` class is added:
```javascript
document.documentElement.classList.contains('dark')
```

2. Verify dark mode CSS exists in globals.css (line 67-127)

3. Check theme provider is working:
```javascript
// In browser console
localStorage.getItem('theme')
// Should return: 'light', 'dark', or 'system'
```

---

### **Issue 4: Tailwind Classes Not Working**

**Cause:** Tailwind CSS not processing the new colors  
**Solution:**

Check `postcss.config.mjs`:
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Verify `globals.css` has:
```css
@import "tailwindcss";
```

---

## Step 7: Deploy to Production

**Only deploy after confirming colors work locally!**

Once verified locally:

```bash
# Commit changes (already done)
git status

# Push to GitHub (already done)
git push origin feature/relivator-ui-integration

# SSH to VPS
ssh root@109.205.181.119

# Deploy
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
npm run build
pm2 restart all
```

---

## Verification Checklist

Before deploying to production, verify:

- [ ] Dev server shows new colors
- [ ] Production build shows new colors
- [ ] Dark mode toggle works
- [ ] CSS variables are correct in DevTools
- [ ] No console errors
- [ ] Hard refresh shows new colors
- [ ] All pages show new colors (not just homepage)

---

## Expected Color Values

### **Light Mode**
- Background: `hsl(45, 40%, 96%)` = `#FAF8F3`
- Foreground: `hsl(150, 30%, 18%)` = `#213B2E`
- Primary: `hsl(140, 40%, 35%)` = `#368A5C`
- Secondary: `hsl(30, 35%, 40%)` = `#8B6F4F`
- Accent: `hsl(40, 80%, 55%)` = `#E8B84D`

### **Dark Mode**
- Background: `hsl(150, 25%, 10%)` = `#131F1A`
- Foreground: `hsl(45, 35%, 90%)` = `#EDE8DC`
- Primary: `hsl(140, 45%, 50%)` = `#45B373`
- Secondary: `hsl(30, 30%, 50%)` = `#A38563`
- Accent: `hsl(40, 75%, 65%)` = `#F0C96F`

---

## Next Steps

1. **Test locally first** - Follow steps 1-6 above
2. **Report results** - Let me know what you see
3. **Deploy only if working** - Don't deploy broken colors

**If colors work locally but not on production:**
- It's a deployment/cache issue on VPS
- Need to clear Next.js cache on VPS
- May need to restart Nginx

**If colors don't work locally:**
- There's a code issue
- Need to investigate further
- Don't deploy yet

---

**Status:** Ready for local testing  
**Next Action:** Run `npm run dev` and check colors

