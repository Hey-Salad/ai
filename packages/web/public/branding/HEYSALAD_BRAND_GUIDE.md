# HeySalad Brand Guidelines

Official brand colors, fonts, and assets for HeySalad.

## 🎨 Brand Colors

### Primary Colors

**Cherry Red** (Primary Brand Color)
- Hex: `#ED4C4C`
- RGB: `rgb(237, 76, 76)`
- Usage: Primary buttons, accents, logo salad

**Peach**
- Hex: `#FAA09A`
- RGB: `rgb(250, 160, 154)`
- Usage: Secondary accents, hover states, highlights

**Light Peach**
- Hex: `#FFD0CD`
- RGB: `rgb(255, 208, 205)`
- Usage: Backgrounds, subtle accents, badges

**White**
- Hex: `#FFFFFF`
- RGB: `rgb(255, 255, 255)`
- Usage: Text on dark backgrounds, cards in dark mode

### Supporting Colors

**Dark Brown** (from logo)
- Hex: `#873535`
- RGB: `rgb(135, 53, 53)`
- Usage: Shadows, depth in illustrations

**Black**
- Hex: `#000000`
- Usage: Text, logo text variant

## 🔤 Typography

### Primary Font: Grandstander
- **Usage:** Headings, logo text, display text
- **Weights:** 400 (Regular), 700 (Bold), 800 (Extra Bold)
- **Style:** Playful, friendly, approachable
- **Google Fonts:** https://fonts.google.com/specimen/Grandstander

### Secondary Font: Figtree
- **Usage:** Body text, UI elements, descriptions
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi Bold), 700 (Bold)
- **Style:** Clean, modern, readable
- **Google Fonts:** https://fonts.google.com/specimen/Figtree

## 🖼️ Logo Assets

### Available Formats

**Full Logo (Logo + Tagline)**
- `HeySalad Logo + Tagline Black.svg` - For light backgrounds
- `HeySalad Logo + Tagline White.svg` - For dark backgrounds
- `HeySalad Logo + Tagline Black.png` - Raster version (light bg)
- `HeySalad Logo + Tagline White.png` - Raster version (dark bg)

**Logo Only**
- `HeySalad Logo Black.svg` - For light backgrounds
- `HeySalad Logo White.svg` - For dark backgrounds
- `HeySalad Logo Black.png` - Raster version (light bg)
- `HeySalad Logo White.png` - Raster version (dark bg)

**Icon/Favicon**
- `Sal.svg` - Salad icon only
- `Sal.png` - Raster icon
- `Sal.ico` - Favicon format

### Logo Usage Guidelines

**Do:**
- Use on solid backgrounds
- Maintain clear space around logo (minimum 20px)
- Use white logo on dark backgrounds
- Use black logo on light backgrounds
- Scale proportionally

**Don't:**
- Distort or stretch the logo
- Change the colors
- Add effects (shadows, gradients, etc.)
- Place on busy backgrounds
- Use low-resolution versions

## 🎯 Brand Voice

**Personality:**
- Friendly and approachable
- Sustainable and conscious
- Innovative and tech-forward
- Empowering and helpful

**Tone:**
- Warm and welcoming
- Clear and informative
- Optimistic and positive
- Professional yet casual

## 🌈 Color Combinations

### Light Mode
```css
Background: #FFFFFF
Text: #000000
Primary: #ED4C4C
Secondary: #FAA09A
Accent: #FFD0CD
```

### Dark Mode
```css
Background: #0a0a0f
Text: #FFFFFF
Primary: #ED4C4C
Secondary: #FAA09A
Accent: #873535
```

### Gradients

**Primary Gradient**
```css
background: linear-gradient(135deg, #ED4C4C, #FAA09A);
```

**Subtle Gradient**
```css
background: linear-gradient(135deg, #FAA09A, #FFD0CD);
```

## 📐 Spacing & Layout

**Base Unit:** 8px

**Spacing Scale:**
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

**Border Radius:**
- Small: 4px
- Medium: 8px
- Large: 12px
- XLarge: 16px
- Round: 999px

## 🎨 UI Components

### Buttons

**Primary Button**
```css
background: #ED4C4C;
color: #FFFFFF;
border-radius: 8px;
padding: 12px 24px;
font-family: 'Figtree', sans-serif;
font-weight: 600;
```

**Secondary Button**
```css
background: transparent;
color: #ED4C4C;
border: 2px solid #ED4C4C;
border-radius: 8px;
padding: 12px 24px;
```

**Hover States**
```css
primary:hover {
  background: #FAA09A;
}

secondary:hover {
  background: #FFD0CD;
  border-color: #FAA09A;
}
```

### Cards
```css
background: #FFFFFF;
border: 1px solid #FFD0CD;
border-radius: 12px;
padding: 24px;
box-shadow: 0 2px 8px rgba(237, 76, 76, 0.08);
```

### Badges
```css
background: #FFD0CD;
color: #873535;
border-radius: 999px;
padding: 4px 12px;
font-size: 12px;
font-weight: 600;
```

## 🌟 Iconography

**Style:** Rounded, friendly, simple
**Stroke Width:** 2px
**Size:** 24x24px (base)
**Color:** Match text color or use Cherry Red for emphasis

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## ✅ Accessibility

**Color Contrast:**
- Text on Cherry Red: Use white (#FFFFFF) - WCAG AAA
- Text on Peach: Use dark brown (#873535) - WCAG AA
- Text on Light Peach: Use black (#000000) - WCAG AAA

**Focus States:**
```css
outline: 2px solid #ED4C4C;
outline-offset: 2px;
```

## 🔗 Resources

- **Website:** https://heysalad.io
- **GitHub:** https://github.com/Hey-Salad
- **Email:** investors@heysalad.io

## 📄 License

All brand assets are proprietary to HeySalad. Use only with permission.

---

**Last Updated:** 2026-02-20
**Version:** 1.0
