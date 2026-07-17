#!/bin/bash

# Performance testing script for Captain Maid
# Tests image sizes, format support, and provides Lighthouse instructions

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Captain Maid — Performance Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if images directory exists
if [ ! -d "public/products" ] && [ ! -d "public/blog" ]; then
    echo -e "${YELLOW}⚠️  No images found in public/products/ or public/blog/${NC}"
    echo "Run this script after adding product and blog images."
    echo ""
    echo "Image preparation steps:"
    echo "1. Add images to public/products/ and public/blog/"
    echo "2. Convert to WebP format: cwebp input.jpg -o output.webp -q 85"
    echo "3. Create responsive versions: @2x.webp, @3x.webp"
    echo "4. Run this script again: ./scripts/test-performance.sh"
    exit 0
fi

# Test product images
echo -e "${BLUE}📸 Product Images${NC}"
echo "─────────────────────────────────────────────────────────────"

if [ -d "public/products" ]; then
    echo "Found product images:"
    for file in public/products/*; do
        if [ -f "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            format=$(file -b "$file" | cut -d' ' -f1)
            echo -e "  ${GREEN}✓${NC} $(basename "$file") — $size ($format)"

            # Check file size (warn if > 50 KB)
            size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            if [ "$size_bytes" -gt 51200 ]; then
                echo -e "    ${YELLOW}⚠ Warning${NC}: File larger than 50 KB — consider optimization"
            fi
        fi
    done
else
    echo -e "  ${RED}✗${NC} No product images directory"
fi
echo ""

# Test blog images
echo -e "${BLUE}📝 Blog Images${NC}"
echo "─────────────────────────────────────────────────────────────"

if [ -d "public/blog" ]; then
    echo "Found blog images:"
    for file in public/blog/*; do
        if [ -f "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            format=$(file -b "$file" | cut -d' ' -f1)
            echo -e "  ${GREEN}✓${NC} $(basename "$file") — $size ($format)"

            # Check file size
            size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            if [ "$size_bytes" -gt 51200 ]; then
                echo -e "    ${YELLOW}⚠ Warning${NC}: File larger than 50 KB — consider optimization"
            fi
        fi
    done
else
    echo -e "  ${RED}✗${NC} No blog images directory"
fi
echo ""

# Check bundle size
echo -e "${BLUE}📦 Build Analysis${NC}"
echo "─────────────────────────────────────────────────────────────"

if [ -d ".next" ]; then
    echo "Next.js build found. Checking bundle sizes..."

    # Rough estimate of main bundle
    if [ -f ".next/static/chunks/main-*.js" ]; then
        main_size=$(du -h .next/static/chunks/main-*.js 2>/dev/null | tail -1 | cut -f1)
        echo -e "  Main bundle: $main_size"
    fi

    echo -e "${YELLOW}ℹ Run 'npm run build' for detailed build analysis${NC}"
else
    echo -e "${YELLOW}⚠ No .next directory found${NC}"
    echo "  Run 'npm run build' to analyze bundle size"
fi
echo ""

# Performance checklist
echo -e "${BLUE}✓ Performance Checklist${NC}"
echo "─────────────────────────────────────────────────────────────"

checklist=(
    "All images have WebP and PNG versions"
    "Image file sizes < 50 KB"
    "Responsive sizes generated (1x, 2x, 3x)"
    "OptimizedImage component used on all images"
    "Hero image has priority={true}"
    "Below-fold images use lazy loading"
    "Width/height set on all images (prevent CLS)"
)

for i in "${!checklist[@]}"; do
    echo "  [ ] ${checklist[$i]}"
done
echo ""

# Lighthouse instructions
echo -e "${BLUE}🔍 Testing with Lighthouse${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "1. Start dev server:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. Open Chrome and go to http://localhost:3000"
echo ""
echo "3. Open Chrome DevTools (F12)"
echo ""
echo "4. Go to Lighthouse tab and click 'Analyze page load'"
echo ""
echo "5. Target scores:"
echo "   • Performance: ${GREEN}90+${NC}"
echo "   • Accessibility: ${GREEN}90+${NC}"
echo "   • Best Practices: ${GREEN}90+${NC}"
echo "   • SEO: ${GREEN}90+${NC}"
echo ""
echo "6. For mobile testing:"
echo "   • Select 'Mobile' device type"
echo "   • Use 'Slow 4G' network throttling"
echo "   • Clear browser cache between runs"
echo ""

# Web Vitals monitoring
echo -e "${BLUE}📊 Real User Monitoring${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "After deployment, monitor with:"
echo ""
echo "1. Google PageSpeed Insights:"
echo "   ${YELLOW}https://pagespeed.web.dev/${NC}"
echo ""
echo "2. Chrome UX Report:"
echo "   ${YELLOW}https://crux.web.dev/${NC}"
echo ""
echo "3. Google Analytics 4:"
echo "   • Navigate to Reports → Engagement → Web Vitals"
echo "   • Monitor LCP, FID, CLS in production"
echo ""

# Dev mode tips
echo -e "${BLUE}💡 Testing Tips${NC}"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "1. Test with network throttling disabled first (baseline)"
echo ""
echo "2. Then test with Slow 3G (realistic mobile experience):"
echo "   • DevTools → Network tab → throttling dropdown"
echo "   • Select 'Slow 3G'"
echo "   • Reload and measure LCP"
echo ""
echo "3. Check CLS manually:"
echo "   • DevTools → Performance tab → record → reload → stop"
echo "   • Look for 'layout-shift' entries in timeline"
echo "   • All shifts should occur during initial load"
echo ""
echo "4. Profile FID:"
echo "   • DevTools → Performance → record"
echo "   • Click buttons/links on page"
echo "   • Stop recording and check task duration"
echo "   • All tasks should be < 100ms"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Performance test complete${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
