# QA Checklist

## Build

- [ ] Clean install succeeds
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Production build passes
- [ ] Preview server works
- [ ] No unresolved imports
- [ ] Repository, lockfile, network panel and production bundle contain no Base44 package/import/config/env/API reference

## Functional

- [ ] All header links work
- [ ] Language switching works
- [ ] Search behavior is defined and works or is intentionally disabled
- [ ] Brand/category/product routes work
- [ ] Product filters update URL and results
- [ ] News cards open articles
- [ ] Newsletter form completes end-to-end
- [ ] Contact/partnership/career forms complete end-to-end
- [ ] 404 and error boundaries work

## Visual

- [ ] Compare 1440 screenshot to target
- [ ] Compare 1024, 768, 390 responsive layouts
- [ ] Header/hero/category/value/news/newsletter/footer hierarchy matches target
- [ ] No unexpected old-deployed sections
- [ ] No placeholder text or fake contacts
- [ ] No remote placeholder images

## Accessibility

- [ ] Keyboard-only navigation
- [ ] Visible focus
- [ ] Logical heading order
- [ ] Form labels and error association
- [ ] Icon buttons have names
- [ ] Contrast AA
- [ ] Reduced motion
- [ ] Screen reader smoke test

## Content and localization

- [ ] English page contains English only
- [ ] Thai page contains Thai only except proper nouns
- [ ] All images have correct alt behavior
- [ ] Claims are approved
- [ ] Contact details are final
- [ ] Date/number formatting follows locale

## SEO

- [ ] Unique title/meta
- [ ] Canonical and hreflang
- [ ] Open Graph image
- [ ] Structured data validates
- [ ] Sitemap includes published localized pages
- [ ] Robots behavior is correct by environment
- [ ] Redirects preserve old URLs where required

## Performance

- [ ] Responsive optimized images
- [ ] Below-fold images lazy-load
- [ ] Fonts do not cause major layout shift
- [ ] No oversized JS libraries without use
- [ ] Lighthouse targets met or variance documented

## Security/privacy

- [ ] No secrets in repository/client bundle
- [ ] CMS permissions are least privilege
- [ ] Upload MIME/size restrictions
- [ ] Form validation, rate limiting and spam control
- [ ] No PII in analytics
- [ ] Consent/retention requirements implemented

## Release

- [ ] Environment variables documented
- [ ] Deployment runbook tested
- [ ] Rollback tested
- [ ] CMS backup/restore documented
- [ ] Stakeholder sign-off recorded
