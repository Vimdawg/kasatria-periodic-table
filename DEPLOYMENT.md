# Deployment Guide

This guide covers deploying the Kasatria Periodic Table application to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. ✅ Google OAuth Client ID configured
2. ✅ Google Sheets published and shared with `lisa@kasatria.com`
3. ✅ Environment variables ready
4. ✅ Code committed to a Git repository

## Vercel Deployment (Recommended)

### 1. Connect Repository

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository

### 2. Configure Environment Variables

In the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_CSV_URL=https://docs.google.com/spreadsheets/d/.../pub?gid=8699197&single=true&output=csv
```

### 3. Update Google Cloud Console

Add your Vercel domain to authorized origins:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized origins:
   - `https://your-project.vercel.app`
   - `https://your-project-git-main.vercel.app`

### 4. Deploy

1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Test the application

## Netlify Deployment

### 1. Build Settings

Configure build settings in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Environment Variables

In Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add your environment variables

### 3. Deploy

1. Connect your Git repository
2. Configure build settings
3. Deploy

## AWS Amplify Deployment

### 1. Connect Repository

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git repository

### 2. Build Settings

Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3. Environment Variables

Add environment variables in Amplify console.

## Railway Deployment

### 1. Connect Repository

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

### 2. Environment Variables

Add environment variables in Railway dashboard.

### 3. Deploy

Railway will automatically detect Next.js and deploy.

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
}

module.exports = nextConfig
```

### 3. Build and Run

```bash
docker build -t kasatria-periodic-table .
docker run -p 3000:3000 kasatria-periodic-table
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | Yes | `123456789-abc.apps.googleusercontent.com` |
| `NEXT_PUBLIC_CSV_URL` | Google Sheets CSV URL | No | `https://docs.google.com/spreadsheets/d/.../pub?output=csv` |

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Google OAuth login works
- [ ] CSV data loads correctly
- [ ] All 4 layouts work (Table, Sphere, Helix, Grid)
- [ ] Animations are smooth
- [ ] Responsive design works on mobile
- [ ] Logout functionality works
- [ ] Performance is acceptable

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **Environment Variables Not Working**
   - Ensure variables are prefixed with `NEXT_PUBLIC_`
   - Check variable names match exactly
   - Verify no extra spaces or quotes

3. **Google OAuth Issues**
   - Verify authorized origins include your domain
   - Check Client ID is correct
   - Ensure Google+ API is enabled

4. **CSV Data Not Loading**
   - Verify Google Sheet is published to web
   - Check CSV URL is accessible
   - Ensure sheet is shared with `lisa@kasatria.com`

### Performance Optimization

1. **Enable Compression**
   - Most platforms enable gzip automatically
   - Consider Brotli compression for better results

2. **CDN Configuration**
   - Use platform's CDN for static assets
   - Configure proper cache headers

3. **Image Optimization**
   - Use Next.js Image component
   - Optimize images before upload

## Monitoring

### Analytics

Consider adding analytics to track usage:

1. **Google Analytics**
2. **Vercel Analytics** (if using Vercel)
3. **Custom event tracking**

### Error Monitoring

1. **Sentry** for error tracking
2. **LogRocket** for session replay
3. **Platform-specific monitoring**

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use platform's secure environment variable storage

2. **CORS Configuration**
   - Configure proper CORS headers
   - Restrict origins to your domains

3. **Content Security Policy**
   - Implement CSP headers
   - Restrict script sources

## Backup and Recovery

1. **Code Backup**
   - Use Git for version control
   - Regular commits and pushes

2. **Data Backup**
   - Google Sheets has built-in version history
   - Export CSV data regularly

3. **Configuration Backup**
   - Document all environment variables
   - Save deployment configurations

