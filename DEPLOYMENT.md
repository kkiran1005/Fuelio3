# GitHub Pages Deployment Guide for Fuelio PWA

## Prerequisites
- GitHub account
- Git installed on your computer

## Step 0: Install Git (if not already installed)

1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt
4. Verify installation: `git --version`

## Step-by-Step Deployment Instructions

### 1. Update the Homepage URL

Edit `package.json` and replace `YOUR-USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR-USERNAME.github.io/Fuelio3"
```

For example, if your username is `johnsmith`, it should be:
```json
"homepage": "https://johnsmith.github.io/Fuelio3"
```

### 2. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Fuelio PWA"
```

### 3. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `Fuelio3` (or any name you prefer)
3. Make it Public (required for free GitHub Pages)
4. Don't initialize with README (we already have files)
5. Click "Create repository"

### 4. Link Local Repository to GitHub

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/Fuelio3.git
git branch -M main
git push -u origin main
```

### 5. Deploy to GitHub Pages

Run the deploy command:

```bash
npm run deploy
```

This will:
- Build your app for production
- Create a `gh-pages` branch
- Push the build to GitHub Pages

### 6. Configure GitHub Pages (if needed)

1. Go to your repository on GitHub
2. Click Settings → Pages (in left sidebar)
3. Under "Source", select branch: `gh-pages` and folder: `/ (root)`
4. Click Save

### 7. Access Your App

After a few minutes, your app will be live at:
```
https://YOUR-USERNAME.github.io/Fuelio3
```

## Updating Your App

Whenever you make changes:

```bash
git add .
git commit -m "Your commit message"
git push
npm run deploy
```

## Troubleshooting

### Issue: Page shows 404
- Wait 5-10 minutes after first deployment
- Check GitHub Pages settings in repository
- Make sure homepage URL in package.json is correct

### Issue: App doesn't work properly
- Check browser console for errors
- Verify all relative paths are correct
- Clear browser cache and reload

### Issue: PWA features not working
- GitHub Pages requires HTTPS (automatically provided)
- Service Worker needs to be registered
- Check browser supports PWA features

## Custom Domain (Optional)

To use a custom domain:
1. Add a CNAME file in the `public` folder with your domain
2. Configure DNS records with your domain provider
3. Update homepage in package.json to your custom domain

## Notes

- The `build` folder is automatically generated and deployed
- Don't manually edit the `gh-pages` branch
- PWA features work best on HTTPS (GitHub Pages provides this)
- First deployment may take a few minutes to go live
