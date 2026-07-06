# MARCUZ Website

Premium digital transformation consulting partner website.

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Vercel

### Quick Deploy
```bash
npm i -g vercel
vercel
```

### Manual Steps
1. Push code to GitHub
2. Go to vercel.com and import project
3. Set environment variables (see .env.example)
4. Deploy

## Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
FORM_SUBMISSION_ENDPOINT=https://api.your-domain.com/discovery
FORM_API_KEY=your-key
```

## Project Structure

```
src/
├── app/          # Pages and layouts
├── components/   # React components
├── content/      # copy.json and content management
├── lib/          # Utilities
└── styles/       # Global styles and design tokens
public/           # Static assets
```

## Deployment Checklist

- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` file
- [ ] Test locally: `npm run dev`
- [ ] Build locally: `npm run build`
- [ ] Add images to `/public`
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up DNS
- [ ] Enable analytics
- [ ] Configure form endpoint

## Vercel Configuration

Configuration is in `vercel.json`:
- Framework: Next.js 14
- Node: 20.x
- Build command: `npm run build`
- Dev command: `npm run dev`

## Support

For questions, refer to MARCUZ documentation or Vercel Next.js deployment guide.
