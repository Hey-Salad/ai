# HeySalad Web UI - Theme Update

Complete dark/light mode theme system with HeySalad branding.

## ✨ What Was Added

### 1. Theme System (`app/styles/theme.css`)
- Complete CSS custom properties system
- Dark mode (default) and light mode support
- HeySalad brand colors:
  - Brand Red: `#ED4C4C` → `#FF6B6B`
  - Brand Green: `#10b981`
  - Brand Blue: `#3b82f6`
  - Brand Teal: `#6ee7b7`
- Semantic color tokens for both themes
- Smooth transitions between themes
- Responsive design utilities

### 2. Theme Toggle Component (`app/components/ThemeToggle.tsx`)
- React component for switching themes
- Persists preference to localStorage
- Respects system preference
- Smooth animations
- Prevents hydration mismatch

### 3. Navigation Component (`app/components/Navigation.tsx`)
- Reusable navigation with HeySalad branding
- Includes theme toggle
- Consistent across all pages

### 4. Updated Root Layout (`app/root.tsx`)
- Imports theme CSS
- Initializes theme before page render (prevents flash)
- Updated favicon to use HeySalad icon

### 5. New Home Page (`app/routes/_index.new.tsx`)
- Uses new theme system
- CSS custom properties for colors
- Utility classes for spacing
- Fully responsive
- Works in both dark and light modes

## 🎨 Brand Colors

### Primary Brand
```css
--brand-red: #ED4C4C;
--brand-red-light: #FF6B6B;
```

### Accent Colors
```css
--brand-green: #10b981;  /* Success, CTA buttons */
--brand-blue: #3b82f6;   /* Info, links */
--brand-teal: #6ee7b7;   /* Highlights, code */
```

### Dark Mode (Default)
```css
--bg-primary: #0a0a0f;
--bg-secondary: #111118;
--bg-tertiary: #1a1a28;
--text-primary: #e0e0f0;
--text-secondary: #8888aa;
--text-tertiary: #555566;
```

### Light Mode
```css
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--bg-tertiary: #f1f3f5;
--text-primary: #1a1a1a;
--text-secondary: #6b7280;
--text-tertiary: #9ca3af;
```

## 🔧 Usage

### Applying Theme Colors
```tsx
// Use CSS custom properties
<div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
  Content
</div>

// Use utility classes
<h1 className="brand-gradient">HeySalad</h1>
<span className="accent-gradient">Highlighted Text</span>
```

### Using Components
```tsx
import { Navigation } from '~/components/Navigation';
import { ThemeToggle } from '~/components/ThemeToggle';

// In your page
<Navigation showDashboard={true} />
```

### Buttons
```tsx
<button className="btn btn-primary">Primary Action</button>
<button className="btn btn-secondary">Secondary Action</button>
<button className="btn btn-danger">Delete</button>
```

### Cards
```tsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Badges
```tsx
<span className="badge badge-success">New Feature</span>
<span className="badge badge-info">Beta</span>
```

## 📱 Responsive Design

The theme system includes responsive utilities:
- Mobile-first approach
- Breakpoint at 768px
- Flexible grid layouts
- Collapsible navigation

## 🚀 Next Steps

1. **Replace old home page:**
   ```bash
   mv packages/web/app/routes/_index.new.tsx packages/web/app/routes/_index.tsx
   ```

2. **Update dashboard to use theme:**
   - Import Navigation component
   - Replace inline styles with CSS custom properties
   - Add ThemeToggle to sidebar

3. **Update other pages:**
   - `/models`
   - `/api/v1`
   - `/auth/login`

4. **Add more components:**
   - Sidebar component
   - Modal component
   - Table component
   - Form components

## 🎯 Benefits

- ✅ Consistent branding across all pages
- ✅ Dark and light mode support
- ✅ Smooth theme transitions
- ✅ Accessible color contrasts
- ✅ Responsive design
- ✅ Reusable components
- ✅ Easy to maintain
- ✅ Performance optimized

## 📝 Files Created

```
packages/web/
├── app/
│   ├── styles/
│   │   └── theme.css              # Complete theme system
│   ├── components/
│   │   ├── ThemeToggle.tsx        # Theme switcher
│   │   └── Navigation.tsx         # Reusable nav
│   ├── routes/
│   │   └── _index.new.tsx         # Updated home page
│   └── root.tsx                   # Updated with theme
└── THEME_UPDATE.md                # This file
```

## 🔍 Testing

1. **Test dark mode:**
   - Default theme should be dark
   - All text should be readable
   - Brand colors should be visible

2. **Test light mode:**
   - Click theme toggle (☀️/🌙)
   - All text should be readable
   - Sufficient contrast

3. **Test persistence:**
   - Toggle theme
   - Refresh page
   - Theme should persist

4. **Test system preference:**
   - Clear localStorage
   - Change system theme
   - App should follow system

---

**Ready to use!** The theme system is complete and ready to be applied across all pages.
