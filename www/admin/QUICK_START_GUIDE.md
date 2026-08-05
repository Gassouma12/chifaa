# Chifaa Admin Panel - Quick Start Guide

## 🔐 Login
- URL: `/admin/admin.html`
- Password: **chichiChifaa**
- Check "Stay connected" to remain logged in

---

## 📋 Main Sections

### 🏠 Home
Edit the homepage video URL that appears when users click the play button.

**Fields:**
- YouTube Video URL

**Action:** Update URL → Click "Save Changes"

---

### ℹ️ About
Manage the About page content including paragraphs and social links.

**Fields:**
- Page Title
- Paragraphs (multiple text areas)
- Social Links (Facebook, Instagram, LinkedIn)

**Action:** Edit content → Changes auto-save locally → Click "Save All Changes" in header

---

### 🗣️ Voices (Blog Posts)
Manage blog articles and voices from the community.

**Current Posts:** 3 articles by Maha Jouini

**Actions:**
- **View:** See all existing articles in cards
- **Edit:** Click ✏️ icon on any card
- **Add New:** Click "+ Add New" button
- **Delete:** Click 🗑️ icon

**Edit Fields:**
- Basic Info: ID, Title, URL Slug
- Author: Select from dropdown
- Images: Cover image (with crop tool)
- Content: Excerpt & Full content (Rich text editor with images)
- Classification: Categories & Tags
- Metadata: Read time, publish date, featured status, views

**Categories Available:**
- Treatment Advice
- Advocacy
- Maha Jouini Stories
- Community Stories
- Research & Insights
- Prevention & Screening
- Survivor Support

---

### 💡 The Founder
Single-item editor for founder information.

**Current Data:** Maha Jouini's profile

**Fields:**
- Name
- Title
- Biography (textarea)
- Profile Image URL

**Action:** Edit fields → Click "Save Changes"

---

### 👥 Team
Manage team member profiles.

**Actions:**
- **Add New:** Click "+ Add New" button
- **Edit:** Click ✏️ icon
- **Delete:** Click 🗑️ icon

**Fields:**
- Basic Info: ID, Name, Role
- Info: Biography
- Images: Profile Picture
- Contact: Email
- Social: LinkedIn URL, Twitter URL

---

### 🎙️ Podcast
Manage podcast episodes.

**Actions:**
- **Add New:** Click "+ Add New" button
- **Edit:** Click ✏️ icon
- **Delete:** Click 🗑️ icon

**Fields:**
- Basic Info: ID, Episode Title
- Content: Description
- Media: Audio URL, Cover Image
- Metadata: Duration, Published Date, Featured status

---

## 💾 Saving Changes

### Option 1: Individual Section Save
- Edit content in a section
- Click the section's "Save Changes" button
- See success toast notification

### Option 2: Save All Changes
- Edit multiple sections
- Click "Save All Changes" in header
- All modified sections save at once

**⚠️ Important:** Changes are stored in memory until you click save. If you refresh without saving, changes will be lost!

---

## 🖼️ Uploading Images

### For Cover Images & Profile Pictures:
1. Click "Upload Image" button
2. Select image file (max 10MB)
3. Crop modal opens:
   - Choose aspect ratio
   - Adjust max width
   - Set quality (90% recommended)
4. Click "Upload Image"
5. Image URL automatically fills in the form

### For Content Images (in Blog Editor):
1. Place cursor where you want image
2. Click image icon in toolbar
3. Follow same crop/upload process
4. Image inserts at cursor position

**Supported formats:** JPEG, PNG, GIF, WebP

---

## 📊 Dashboard Stats

The welcome screen shows:
- **Team Members:** Count of team profiles
- **Podcast Episodes:** Count of episodes
- **Founder Info:** 1 if data exists
- **Voices Posts:** Count of blog articles

---

## 🎨 Design Features

### Colors (matching website):
- Primary: Soft Pink (#E8A0B0)
- Accent: Deep Rose (#C4687E)
- Background: Warm Cream (#F5EFE6)
- Text: Dark Brown (#2C2420)

### Fonts:
- Headings: Cormorant Garamond (serif)
- Body: DM Sans (sans-serif)

### Animations:
- Smooth transitions on all interactions
- Fade-in effects when loading sections
- Hover effects on buttons and cards

---

## 📱 Mobile Access

The admin panel is responsive:
- **Hamburger menu** appears on mobile
- Click to open/close sidebar
- All features work on touch devices

---

## 🔧 Troubleshooting

### Changes don't save:
1. Check console for errors (F12)
2. Ensure PHP is running (XAMPP/WAMP/local server)
3. Verify write permissions on `/data/` folder

### Images don't upload:
1. Check image size (max 10MB)
2. Verify `/assets/images/` folders exist
3. Check write permissions on image directories

### Can't login:
- Double-check password: **chichiChifaa** (case-sensitive)
- Clear browser cache and try again
- Check browser console for errors

### Section not loading:
- Refresh the page
- Check that corresponding JSON file exists in `/data/`
- View browser console for specific error

---

## 📤 Export & Backup

**Export All Data:**
1. Click "Export All Data" button in sidebar
2. Downloads JSON file with all content
3. Filename: `Chifaa-backup-[timestamp].json`

**Use for:**
- Creating backups before major changes
- Migrating data between environments
- Reviewing all content structure

---

## 🎯 Best Practices

1. **Regular Backups:** Export data weekly
2. **Test Changes:** Make small edits and test before bulk changes
3. **Image Optimization:** Compress images before upload for faster loading
4. **Consistent Naming:** Use clear, descriptive titles and slugs
5. **Categories:** Keep voice posts properly categorized
6. **Preview:** Check website after saving to verify changes appear correctly

---

## 🔗 Related Files

- **Data Storage:** `/data/*.json`
- **Images:** `/assets/images/`
- **API:** `/admin/api.php`
- **Admin Panel:** `/admin/admin.html`

---

## 💬 Tips

- Use the **rich text editor** for blog posts - it supports formatting, links, and images
- **Slug fields** should be lowercase with hyphens (e.g., "my-article-title")
- **Featured** checkbox makes items appear prominently on the website
- **Read time** helps users know how long articles take
- Keep **bios concise** - 2-3 sentences work best

---

## ✨ Ready to Start!

1. Login with password
2. Click a section in the sidebar
3. Make your edits
4. Save changes
5. Check the website to see updates live

**Need help?** Check `ADMIN_FIXES_SUMMARY.md` for technical details.
