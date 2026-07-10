# MARCUZ Website - Vercel Deployment Guide

**Status**: Ready for deployment  
**Framework**: Next.js 14  
**Node Version**: 20.x  
**Date**: 2026-07-05

---

## Pre-Deployment Checklist

### Code & Configuration
- [x] Next.js project structure complete
- [x] All pages assembled (11 pages)
- [x] Components built (Header, Footer)
- [x] Design system configured
- [x] Content management (copy.json)
- [x] TypeScript configuration
- [x] Package.json configured
- [x] .gitignore set up

### Vercel Configuration
- [x] vercel.json created
- [x] Build command: `npm run build`
- [x] Dev command: `npm run dev`
- [x] Node.js 20.x specified
- [x] Framework: Next.js 14

### Environment Setup
- [ ] .env.local created (copy from .env.example)
- [ ] NEXT_PUBLIC_SITE_URL set
- [ ] FORM_SUBMISSION_ENDPOINT configured
- [ ] FORM_API_KEY added
- [ ] Analytics ID configured (optional)

---

## Deployment Steps

### Option 1: Quick Deploy with Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd marcuz-website
vercel

# Follow prompts:
# - Confirm project setup
# - Link to GitHub (optional)
# - Configure environment variables
# - Deploy!
```

**Time**: ~3-5 minutes  
**Result**: Instant URL for testing

### Option 2: GitHub + Vercel Integration

1. **Push to GitHub**
   ```bash
   cd marcuz-website
   git init
   git add .
   git commit -m "Initial MARCUZ website commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/marcuz-website.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com/import
   - Select GitHub repository
   - Click "Import"
   - Configure environment variables:
     - NEXT_PUBLIC_SITE_URL
     - FORM_SUBMISSION_ENDPOINT
     - FORM_API_KEY
   - Click "Deploy"

3. **Configure Custom Domain**
   - In Vercel project settings
   - Add your domain (marcuz.com or similar)
   - Update DNS records as instructed

---

## Post-Deployment

### Testing
- [ ] Visit deployment URL
- [ ] Test all page links
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Test discovery form
- [ ] Check SEO tags in browser DevTools
- [ ] Verify images load correctly
- [ ] Test keyboard navigation
- [ ] Check accessibility with WAVE tool

### Optimization
- [ ] Add images to `/public`
- [ ] Configure image optimization in next.config.js
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure form submission endpoint
- [ ] Add custom domain
- [ ] Set up email notifications for form submissions
- [ ] Enable Vercel Analytics
- [ ] Monitor Core Web Vitals

### Monitoring
- [ ] Set up Vercel Analytics
- [ ] Monitor deployment logs
- [ ] Check error tracking
- [ ] Review performance metrics
- [ ] Set up uptime monitoring

---

## Environment Variables Needed

```env
# Required for deployment
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# For form submissions
FORM_SUBMISSION_ENDPOINT=https://api.your-domain.com/discovery
FORM_API_KEY=your-secret-api-key

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Common Issues & Solutions

### Build Fails
- Check Node.js version (should be 20.x)
- Verify all dependencies are listed in package.json
- Check for TypeScript errors: `npm run build` locally first

### Images Not Showing
- Add images to `/public` folder
- Reference as `/image-name.jpg` in content
- Run `npm run build` to test

### Form Not Submitting
- Verify FORM_SUBMISSION_ENDPOINT is set
- Check API endpoint is accessible
- Verify FORM_API_KEY is correct
- Check browser console for errors

### SEO Not Working
- Verify metadata is in layout.tsx
- Check OpenGraph tags
- Test with: https://www.opengraph.xyz/

---

## Performance Targets

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Page Load Time**: < 2s

---

## Rollback Plan

If deployment issues occur:

```bash
# Rollback to previous deployment
vercel rollback

# Or redeploy specific commit
git reset --hard <commit-hash>
git push -f
# Vercel will auto-deploy
```

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Deployment Guide**: https://vercel.com/docs/frameworks/nextjs
- **Troubleshooting**: https://vercel.com/docs/platform/troubleshooting

---

**Ready to deploy!** 🚀

Execute `vercel deploy` or use GitHub integration to go live.
