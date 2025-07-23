# Firebase Project Setup Guide 🔥

## Quick Setup Steps

### 1. Create Firebase Project
1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Project name**: `json-ordering-tool`
4. **Google Analytics**: Choose "No" (not needed for this project)
5. **Click "Create project"**

### 2. Enable Firebase Hosting
1. **In your new Firebase project**, click "Hosting" in left sidebar
2. **Click "Get started"**
3. **Follow the wizard** (you can skip CLI steps since we have GitHub Actions)

### 3. Connect GitHub Repository
1. **In Firebase Console** → **Hosting** → **GitHub tab**
2. **Click "Authorize Firebase to access GitHub"**
3. **Select repository**: `edmondmiu/json-ordering-tool`
4. **Choose deployment settings**:
   - Branch: `main`
   - Build command: `npm run build`
   - Output directory: `out`
5. **Click "Save"**

### 4. Automatic Deployment
Once connected, Firebase will:
- ✅ Add GitHub Actions secrets automatically
- ✅ Deploy on every push to `main` branch
- ✅ Create preview URLs for pull requests

### 5. Access Your Live App
After the first deployment completes:
🌐 **https://json-ordering-tool.web.app**

## Alternative: Manual CLI Setup

If you prefer manual setup:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy manually
firebase deploy
```

## Troubleshooting

**Issue**: GitHub Actions failing?
- Check that Firebase service account secret is added to GitHub
- Verify project ID matches in workflows: `json-ordering-tool`

**Issue**: Build errors?
- Ensure Node.js version is 18+ in GitHub Actions
- Check that all dependencies are in package.json

**Issue**: 404 on routes?
- Firebase.json is configured for SPA routing
- All routes redirect to index.html

## Next Steps After Deployment
1. **Test the live app** at your Firebase hosting URL
2. **Share the link** with users
3. **Monitor usage** in Firebase Console → Analytics
4. **Set up custom domain** (optional) in Firebase Console → Hosting

---

**Repository**: https://github.com/edmondmiu/json-ordering-tool
**Documentation**: See DEPLOYMENT.md for detailed technical setup