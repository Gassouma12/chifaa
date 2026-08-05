# Chifaa Admin Panel

A beautiful, user-friendly content management system for the Chifaa website, designed to match the website's aesthetic with soft pink tones, elegant typography, and smooth animations.

---

## 🌟 Features

- **Easy Content Management** - Edit all website content from one place
- **Rich Text Editor** - Quill.js powered editor with image support
- **Image Management** - Crop, resize, and upload images with ease
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Preview** - See your changes before publishing
- **Data Export** - Backup your content anytime
- **Secure Access** - Password protected with session management

---

## 🎨 Sections

| Section | Description | Features |
|---------|-------------|----------|
| 🏠 **Home** | Homepage settings | Video URL configuration |
| ℹ️ **About** | About page content | Title, paragraphs, social links |
| 🗣️ **Voices** | Blog posts & articles | Full CRUD with rich editor |
| 💡 **The Founder** | Founder profile | Name, title, bio, image |
| 👥 **Team** | Team member profiles | Full profiles with social links |
| 🎙️ **Podcast** | Podcast episodes | Audio URLs, covers, metadata |

---

## 🚀 Quick Start

### 1. Access Admin Panel
```
URL: /admin/admin.html
Password: chichiChifaa
```

### 2. Navigate
- Use sidebar to switch between sections
- Mobile: Tap hamburger menu (☰)

### 3. Edit Content
- Click on any section
- Edit fields as needed
- Upload images with crop tool

### 4. Save Changes
- Click "Save Changes" for individual sections
- Or "Save All Changes" in header for everything

---

## 📁 Project Structure

```
/admin/
  ├── admin.html          # Main admin interface
  ├── admin-app.js        # Application logic
  ├── admin-style.css     # Styling (matches website)
  ├── api.php             # Backend API
  ├── README.md           # This file
  ├── QUICK_START_GUIDE.md   # Detailed usage guide
  └── ADMIN_FIXES_SUMMARY.md # Technical documentation

/data/
  ├── home.json           # Home page data
  ├── about.json          # About page data
  ├── blog.json           # Blog posts (Voices)
  ├── founder.json        # Founder information
  ├── team.json           # Team members
  ├── podcast.json        # Podcast episodes
  ├── authors.json        # Authors data
  ├── partners.json       # Partners data
  ├── contact.json        # Contact information
  └── aiCompanion.json    # AI Companion data

/assets/images/
  ├── articles/           # Blog article images
  ├── team/              # Team member photos
  ├── podcast/           # Podcast covers
  ├── founders/          # Founder images
  ├── authors/           # Author photos
  └── partners/          # Partner logos
```

---

## 🎨 Design System

### Colors
```css
Primary:    #E8A0B0  /* Soft Pink */
Accent:     #C4687E  /* Deep Rose */
Background: #F5EFE6  /* Warm Cream */
Healing:    #7BBCB0  /* Healing Teal */
Text:       #2C2420  /* Dark Brown */
Surface:    #FDFAF7  /* Off White */
```

### Typography
- **Headings:** Cormorant Garamond (serif, elegant)
- **Body:** DM Sans (sans-serif, clean)

### Components
- Smooth animations on all interactions
- Rounded corners (8-12px border radius)
- Subtle shadows for depth
- Responsive grid layouts
- Touch-friendly mobile interface

---

## 🔧 Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, flexbox, grid
- **JavaScript (ES6+)** - Modern async/await patterns

### Libraries
- **Quill.js 1.3.6** - Rich text editor
- **Cropper.js 1.6.1** - Image cropping
- **Google Fonts** - Cormorant Garamond & DM Sans

### Backend
- **PHP** - API endpoints
- **JSON** - Data storage

---

## 📝 Data Management

### Read Data
```javascript
// Data loaded automatically on init
const data = currentData.blog; // Access blog posts
```

### Update Data
```javascript
// Make changes in memory
currentData.blog[0].title = "New Title";
hasChanges = true;
```

### Save Data
```javascript
// Save via API
await saveAllChanges(); // Saves all sections
await saveBlogData();   // Save specific section
```

### API Endpoints
```
GET  /admin/api.php?action=read&file={section}
POST /admin/api.php?action=write&file={section}
POST /admin/api.php?action=upload-image
```

---

## 🖼️ Image Handling

### Upload Process
1. **Select** - Choose image file
2. **Crop** - Adjust with Cropper.js
3. **Optimize** - Set quality & max width
4. **Upload** - POST to API
5. **Store** - Save in appropriate directory
6. **Reference** - URL saved in JSON

### Image Specifications
- **Format:** JPEG, PNG, GIF, WebP
- **Max Size:** 10MB (client-side)
- **Recommended Quality:** 90%
- **Max Width:** 1200px default

---

## 🔐 Authentication

### Login System
- Single admin password
- Session storage (temporary)
- Local storage (persistent)
- Auto-logout on browser close (if not "stay connected")

### Password
```
chichiChifaa
```

⚠️ **Security Note:** For production, implement:
- Environment variables for password
- Server-side session management
- HTTPS only
- Rate limiting
- CSRF protection

---

## 📊 Features by Section

### Voices (Blog)
- ✅ Rich text editor with formatting
- ✅ Image uploads within content
- ✅ Cover image with crop tool
- ✅ Categories and tags
- ✅ Author attribution
- ✅ Read time calculation
- ✅ Published date
- ✅ Featured posts
- ✅ View counter

### Team
- ✅ Profile pictures
- ✅ Role and bio
- ✅ Contact information
- ✅ Social media links
- ✅ Add/Edit/Delete members

### Podcast
- ✅ Episode management
- ✅ Audio URL linking
- ✅ Cover images
- ✅ Duration tracking
- ✅ Publishing dates
- ✅ Featured episodes

---

## 🐛 Troubleshooting

### Common Issues

**Q: Changes don't save**
```
A: Check PHP server is running
   Verify write permissions on /data/
   Check browser console for errors
```

**Q: Images won't upload**
```
A: Verify /assets/images/ directories exist
   Check write permissions
   Ensure file size < 10MB
   Try different image format
```

**Q: Can't login**
```
A: Password is case-sensitive: chichiChifaa
   Clear browser cache
   Try incognito/private window
```

**Q: Section loads empty**
```
A: Check JSON file exists in /data/
   Verify file permissions
   Check JSON syntax is valid
```

---

## 🔄 Updates & Maintenance

### Regular Tasks
- [ ] Weekly data backups (Export All Data)
- [ ] Monthly password updates (in production)
- [ ] Image cleanup (remove unused)
- [ ] Content review and updates

### Before Major Changes
1. Export all data (backup)
2. Test in staging environment
3. Verify on multiple browsers
4. Check mobile responsiveness

---

## 📚 Documentation

### For Users
- **QUICK_START_GUIDE.md** - Step-by-step usage instructions
- Covers all sections and common tasks

### For Developers
- **ADMIN_FIXES_SUMMARY.md** - Technical implementation details
- Code structure, API endpoints, data flow

---

## 🎯 Best Practices

### Content
1. **Images** - Optimize before upload (compress, resize)
2. **Titles** - Clear, descriptive, SEO-friendly
3. **Slugs** - lowercase-with-hyphens-only
4. **Categories** - Use consistently across posts
5. **Dates** - Use YYYY-MM-DD format

### Workflow
1. **Plan** - Know what you want to change
2. **Edit** - Make changes carefully
3. **Preview** - Check how it looks
4. **Save** - Persist your changes
5. **Verify** - View on actual website

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile | Modern | ✅ Fully Supported |

---

## 📞 Support

### Need Help?
1. Check **QUICK_START_GUIDE.md** for usage help
2. Review **ADMIN_FIXES_SUMMARY.md** for technical details
3. Check browser console for error messages
4. Verify server logs for PHP errors

### Report Issues
Include:
- Browser and version
- Steps to reproduce
- Error messages
- Screenshots if applicable

---

## 🎉 Changelog

### Version 2.0 (Current)
- ✨ Complete UI redesign to match website
- ✨ Added Team section
- ✨ Added Podcast section
- ✨ Improved Founder section
- ✨ Fixed data persistence
- ✨ Added proper animations
- ✨ Mobile responsive improvements
- 🐛 Fixed missing render functions
- 🐛 Fixed save functionality
- 🎨 Applied website color scheme
- 🎨 Added Google Fonts

---

## 📄 License

Part of the Chifaa project - For internal use only.

---

## 🙏 Credits

Built with love for the Chifaa community.

**Design:** Inspired by Chifaa website aesthetic  
**Development:** Enhanced admin panel with modern features  
**Mission:** Supporting women's health through technology

---

**Ready to manage your content? [Get Started →](#-quick-start)**
