# Killgorithm Landing Page - Deployment Guide

## 🚀 Deploy to Vercel

### Quick Deploy

1. **Install Vercel CLI (if not already installed)**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from the project directory**
   ```bash
   cd WEB/killgorithm-landing
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (first time)
   - Project name? **killgorithm-landing** (or your preferred name)
   - Directory? **./** (press Enter)
   - Override settings? **N**

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository or drag & drop the `WEB/killgorithm-landing` folder
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

## ✅ Pre-Deployment Checklist

- [x] Production build tested (`npm run build`)
- [x] No linter errors
- [x] Music player functionality working
- [x] Video player functionality working
- [x] All assets in `/public` folder
- [x] Responsive design tested
- [x] Lyrics feature commented out (to be enabled later)
- [x] Music overlap bug fixed (video pauses player)

## 🎵 Project Features

- **Animated cyber background** with "The Guy"
- **4 song avatars** with unique visuals
- **Music player** with progress bar and controls
- **YouTube video integration** for Nemo's Tears
- **Manifesto modal** with cyber aesthetic
- **Lightning effects** and particle systems
- **Fully responsive** (mobile, tablet, desktop)

## 📁 Required Files

All required files are in `/public`:
- `/public/audio/` - All 4 MP3 tracks
- `/public/models/` - 3D GLB models
- `/public/GUY.mov` - Background video
- `/public/letters.mov` - Title animation
- `/public/Robocode-ov3vx.ttf` - Custom font
- Various background images

## 🔧 Future Improvements

- [ ] Complete synced lyrics timing for all songs
- [ ] Add more songs/avatars
- [ ] Optimize bundle size (code splitting)
- [ ] Add more 3D models and animations

## 🎸 Built with

- React 19
- Vite 7
- Three.js / React Three Fiber
- Framer Motion
- Custom WebGL shaders

---

**KILLGORITHM** - Technically complete. Humanly unfinished.

