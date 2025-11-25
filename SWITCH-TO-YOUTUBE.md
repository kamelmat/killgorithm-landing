# 🎸 Switch to YouTube Audio Streaming

## Current vs YouTube Approach

### ❌ Current (Local MP3 files)
```
Pros: Full control, offline capability
Cons: 150 MB deployment, bandwidth costs, slow loading
```

### ✅ YouTube Streaming
```
Pros: Free CDN, unlimited bandwidth, <5 MB deployment, YouTube presence
Cons: Requires internet, YouTube dependency
```

---

## 🚀 How to Switch

### Step 1: Upload Your Songs to YouTube

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Upload each song:
   - **Nemo's Tears** - ✅ Already uploaded (XdClrwJJ60g)
   - **Ave de Presa** - Upload and get video ID
   - **To Hell & Back** - Upload and get video ID
   - **Courage** - Upload and get video ID

**Upload Tips:**
- Can be just audio + static image (album art)
- Set privacy to **UNLISTED** (hidden but accessible via link)
- Add full lyrics in description
- Title format: "KILLGORITHM - [Song Name]"

### Step 2: Get Video IDs

From the URL: `https://youtube.com/watch?v=XdClrwJJ60g`
The video ID is: `XdClrwJJ60g` (everything after `v=`)

### Step 3: Update the Code

**Change ONE line in `App.jsx`:**

```javascript
// OLD (local MP3s):
import { useAudioManager } from './hooks/useAudioManager'

// NEW (YouTube streaming):
import { useAudioManager } from './hooks/useYouTubeAudioManager'
```

That's it! The rest of your code stays the same because I designed the YouTube manager with the same interface.

### Step 4: Add Your Video IDs

Edit `src/hooks/useYouTubeAudioManager.js`:

```javascript
const SONGS = [
  { 
    id: 'nemos-tears', 
    title: 'Nemo\'s Tears', 
    youtubeId: 'XdClrwJJ60g' 
  },
  { 
    id: 'ave-de-presa', 
    title: 'Ave de Presa', 
    youtubeId: 'PASTE_YOUR_VIDEO_ID_HERE' // ← Update
  },
  { 
    id: 'to-hell-and-back', 
    title: 'To Hell & Back', 
    youtubeId: 'PASTE_YOUR_VIDEO_ID_HERE' // ← Update
  },
  { 
    id: 'courage', 
    title: 'Courage', 
    youtubeId: 'PASTE_YOUR_VIDEO_ID_HERE' // ← Update
  }
]
```

### Step 5: Remove Audio Files (Optional)

After YouTube is working, you can delete `/public/audio/` folder to reduce deployment size:

```bash
# Backup first!
mv public/audio ~/Desktop/killgorithm-audio-backup

# Now deploy without audio files
npm run build
```

New deployment size: **~5-10 MB** (vs 150 MB!)

---

## 📊 Comparison

| Feature | Local MP3 | YouTube Streaming |
|---------|-----------|-------------------|
| **Deployment Size** | 150 MB | <10 MB |
| **Bandwidth Costs** | Vercel limits | Unlimited (free) |
| **Loading Speed** | Slower | Faster (YouTube CDN) |
| **Mobile Optimized** | Manual | Automatic |
| **Analytics** | None | YouTube Studio |
| **Discoverability** | None | YouTube search |
| **Monetization** | None | YouTube ads |
| **Setup Complexity** | None | Upload once |
| **Maintenance** | Redeploy for changes | Re-upload to YouTube |

---

## 🎯 Recommended Approach

### **Hybrid Strategy** (Best of Both Worlds)

Keep current setup for now, add YouTube option:

```javascript
// In useAudioManager.js, add fallback:
const USE_YOUTUBE = import.meta.env.VITE_USE_YOUTUBE === 'true'

// Then in App.jsx:
const audioManager = USE_YOUTUBE 
  ? useYouTubeAudioManager() 
  : useAudioManager()
```

**Benefits:**
- Switch between local and YouTube with env variable
- Test both approaches
- Keep local files as backup
- Easy A/B testing

---

## ✅ What to Send Me

Once you upload the 3 remaining songs, send me:

```
Ave de Presa YouTube ID: _____________
To Hell & Back YouTube ID: _____________
Courage YouTube ID: _____________
```

I'll update the config and test that everything works!

---

## 🎸 Bonus: Create a Playlist

After uploading all songs:

1. YouTube Studio → Playlists
2. Create new: "KILLGORITHM - 2025 EP"
3. Add all 4 songs
4. Set privacy: Public or Unlisted
5. Share playlist URL on social media!

**Example:**
`https://youtube.com/playlist?list=YOUR_PLAYLIST_ID`

---

**This is the professional way.** Every major artist uses streaming platforms. You get distribution + your custom website experience. Win-win! 🤘

