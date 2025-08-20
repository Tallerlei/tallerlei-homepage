# Continuous Integration & Deployment Setup

This document outlines how to set up continuous integration and deployment (CI/CD) for the Tallerlei Homepage Angular application. The setup will automatically deploy the website whenever changes are pushed to the main branch.

## Overview

The CI/CD pipeline will:
- Automatically trigger on commits to the `main` branch
- Build the Angular application for production
- Run tests and quality checks
- Deploy the built application to a hosting service
- Provide feedback on deployment status

## Recommended Hosting Options

### 1. GitHub Pages (Free)
Perfect for static sites and GitHub integration.

**Setup:**
1. Build artifacts are stored in `dist/tallerlei-homepage/`
2. Use GitHub Actions to build and deploy
3. Enable GitHub Pages in repository settings

### 2. Vercel (Free/Paid)
Excellent for Angular applications with automatic deployments.

**Setup:**
1. Connect repository to Vercel
2. Configure build command: `npm run build`
3. Set output directory: `dist/tallerlei-homepage`

### 3. Netlify (Free/Paid)
Great for static sites with form handling and edge functions.

**Setup:**
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist/tallerlei-homepage`

## GitHub Actions CI/CD Setup

### Option 1: GitHub Pages Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test -- --watch=false --browsers=ChromeHeadless
      
    - name: Build application
      run: npm run build --if-present
      
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/tallerlei-homepage
```

### Option 2: Vercel Deployment

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/tallerlei-homepage"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

Then connect your GitHub repository to Vercel dashboard.

### Option 3: Netlify Deployment

Create `netlify.toml`:

```toml
[build]
  base = "/"
  command = "npm run build"
  publish = "dist/tallerlei-homepage"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

## Environment Configuration

### Production Environment Variables

Create environment-specific configurations:

**src/environments/environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.tallerlei.dev',
  analytics: {
    googleId: 'GA-XXXXXXXXX'
  }
};
```

### Build Optimization

Ensure your `angular.json` includes production optimizations:

```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kb",
          "maximumError": "1mb"
        }
      ],
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "outputHashing": "all",
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

## Quality Checks & Testing

### Pre-deployment Checks

Add these scripts to your CI pipeline:

```yaml
- name: Lint code
  run: npm run lint

- name: Run unit tests
  run: npm test -- --watch=false --browsers=ChromeHeadless --code-coverage

- name: Build for production
  run: npm run build --configuration=production

- name: Check bundle size
  run: npm run analyze # if bundler-analyzer is configured
```

### Package.json Scripts

Ensure these scripts exist in your `package.json`:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",
    "build:prod": "ng build --configuration=production",
    "analyze": "npx webpack-bundle-analyzer dist/tallerlei-homepage/stats.json"
  }
}
```

## Security Considerations

### Environment Secrets

- Store sensitive information in repository secrets
- Use environment variables for configuration
- Never commit API keys or credentials to the repository

**GitHub Secrets Setup:**
1. Go to Repository → Settings → Secrets and Variables → Actions
2. Add secrets like `API_KEY`, `DATABASE_URL`, etc.
3. Reference in workflows: `${{ secrets.API_KEY }}`

### Content Security Policy

Add CSP headers for security:

```html
<!-- In src/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self';">
```

## Performance Optimization

### Caching Strategy

**For GitHub Pages:**
```yaml
- name: Configure caching
  run: |
    echo "Cache-Control: public, max-age=31536000" >> dist/tallerlei-homepage/.htaccess
```

**For Netlify:**
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### Build Performance

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## Monitoring & Analytics

### Deployment Notifications

Add Slack/Discord notifications:

```yaml
- name: Notify deployment
  if: success()
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"✅ Tallerlei Homepage deployed successfully!"}' \
      ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Performance Monitoring

Consider integrating:
- Google Analytics
- Lighthouse CI for performance monitoring
- Sentry for error tracking

## Getting Started

1. **Choose a hosting platform** (Vercel recommended for simplicity)
2. **Copy the appropriate configuration files** to your repository
3. **Set up environment variables** and secrets
4. **Test the pipeline** with a small change
5. **Configure domain and SSL** if using a custom domain

## Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**Deployment fails:**
- Verify publish directory path
- Check file permissions and output structure
- Review hosting service logs

**Performance issues:**
- Analyze bundle size
- Implement lazy loading
- Optimize images and assets

## Next Steps

Once CI/CD is set up:

1. **Custom Domain:** Configure a custom domain (e.g., tallerlei.dev)
2. **SSL Certificate:** Ensure HTTPS is enabled
3. **Performance Monitoring:** Set up analytics and monitoring
4. **SEO Optimization:** Add meta tags and structured data
5. **Progressive Web App:** Consider PWA features for mobile users

This setup ensures that your portfolio website is automatically deployed with every update, maintaining a professional and up-to-date online presence.