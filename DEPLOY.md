# GitHub Pages Deployment Guide

This guide will help you deploy your Snake Bite Management Portal to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Your project repository on GitHub
3. Node.js and npm installed

## Step 1: Update package.json

Before deploying, you need to update the `homepage` field in `package.json` with your GitHub repository URL:

```json
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

For example, if your username is `johndoe` and repo is `snake-bite-portal`:
```json
"homepage": "https://johndoe.github.io/snake-bite-portal"
```

## Step 2: Install gh-pages

The `gh-pages` package is already added to `package.json`. Install it:

```bash
npm install
```

## Step 3: Build and Deploy

Run the deploy command:

```bash
npm run deploy
```

This will:
1. Build your React app for production
2. Deploy it to the `gh-pages` branch
3. Make it available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch and **/ (root)** folder
6. Click **Save**

Your site should be live in a few minutes!

## Step 5: Backend API Configuration

**Important:** The React app needs a backend API to save data. You have two options:

### Option A: Deploy Backend Separately (Recommended)

Deploy your backend (`backend.py`) to a service like:
- Heroku
- Railway
- Render
- PythonAnywhere

Then update the API URL in your deployed app by setting an environment variable or updating `src/config.js`.

### Option B: Use Environment Variables

Create a `.env.production` file in the root directory:

```
REACT_APP_API_URL=https://your-backend-api.herokuapp.com
```

Then rebuild and redeploy:
```bash
npm run deploy
```

## Updating Your Deployment

Whenever you make changes:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Deploy again:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Site shows blank page
- Check browser console for errors
- Verify the `homepage` field in `package.json` is correct
- Make sure GitHub Pages is enabled in repository settings

### API calls failing
- Verify your backend API is deployed and accessible
- Check CORS settings on your backend
- Update `REACT_APP_API_URL` environment variable

### Build errors
- Make sure all dependencies are installed: `npm install`
- Check for any TypeScript or linting errors
- Verify all imports are correct

## Notes

- The `gh-pages` branch is automatically created and updated by the deploy script
- Don't manually edit the `gh-pages` branch
- Your main code stays on `main` or `master` branch
- The build folder is automatically generated and deployed

