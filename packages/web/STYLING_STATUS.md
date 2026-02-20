# HeySalad AI - Styling Status

## Overview
This document tracks the styling consistency across the HeySalad AI web application.

## Brand Colors (HeySalad)
- Primary (Cherry Red): `#E01D1D`
- Background Dark: `#000000` or `#0a0a0a`
- Background Secondary: `#1a1a1a`
- Border: `#2a2a2a` or `border-zinc-800`
- Text: White/Zinc colors

## Components Status

### ✅ Properly Styled (HeySalad Branding)

#### LoginModal.tsx
- Uses Cherry Red (#E01D1D) for primary button
- Black/zinc backgrounds (zinc-900, zinc-800)
- Proper border colors (zinc-800, zinc-700)
- Updated onboarding copy for AI platform
- Benefits section added for signup
- Consistent with HeySalad brand

#### LandingPageSimple.tsx
- Uses Cherry Red (#E01D1D) for CTAs
- Black background (#000000)
- Zinc borders and secondary backgrounds
- HeySalad logo properly displayed
- AI platform messaging
- Feature cards with hover effects

#### Layout.tsx
- Dark theme with #0a0a0a and #1a1a1a backgrounds
- Cherry Red accent for user avatar
- Zinc borders throughout
- Proper sidebar styling
- Mobile responsive

### ⚠️ Needs Review (Legacy Harmony Structure)

The following pages still contain HR/Operations Manager structure from Harmony:
- HRManagerDashboard.tsx
- OperationsManagerDashboard.tsx
- WarehouseStaffDashboard.tsx
- All role-specific pages (Employees, Packages, etc.)

**Note:** These pages use consistent HeySalad colors but contain Harmony-specific content (HR, Operations, Warehouse roles). The user wants to eventually replace these with AI dashboard features.

## Styling Consistency Checklist

### Colors
- ✅ Primary buttons use #E01D1D
- ✅ Backgrounds use black/zinc palette
- ✅ Borders use zinc-800/zinc-700
- ✅ Text uses white/zinc colors
- ✅ Hover states use darker red (#c91919)

### Typography
- ✅ Headings use proper font weights
- ✅ Body text uses readable sizes
- ✅ Consistent spacing

### Components
- ✅ Buttons have consistent styling
- ✅ Inputs use zinc backgrounds with red focus rings
- ✅ Modals use proper backdrop and borders
- ✅ Cards have consistent padding and borders

### Responsive Design
- ✅ Mobile menu works properly
- ✅ Layouts adapt to screen sizes
- ✅ Touch targets are appropriate

## Current Focus: Authentication

The immediate priority is fixing the authentication flow. Once that works:
1. Test the complete user journey
2. Verify styling across all authenticated pages
3. Replace Harmony-specific content with AI dashboard features
4. Ensure consistent HeySalad branding throughout

## Pages to Update (Future)

When building the AI dashboard, these pages need to be created/updated:
1. API Keys Management
2. Usage Analytics Dashboard
3. Provider Configuration
4. Billing & Usage
5. API Documentation
6. Settings & Profile

All new pages should follow the established HeySalad styling:
- Cherry Red (#E01D1D) for primary actions
- Black/zinc backgrounds
- Consistent spacing and borders
- Mobile-first responsive design

## Assets

### Logo Files
- `/heysalad-white-logo.svg` - Main logo (white for dark backgrounds)
- `/HeySalad_Icon-removebg-preview.png` - Icon/favicon (88KB)

### Fonts
- Headings: Grandstander
- Body: Figtree

## Testing Checklist

- [ ] Test login modal on mobile
- [ ] Test signup flow on desktop
- [ ] Verify all buttons use correct red
- [ ] Check hover states
- [ ] Test dark mode consistency
- [ ] Verify logo displays correctly
- [ ] Check responsive breakpoints
- [ ] Test form validation styling
- [ ] Verify error message styling
- [ ] Check loading states

## Notes

- The app currently uses a mix of AI landing page and Harmony dashboard structure
- Authentication is the current blocker
- Once auth works, we can progressively replace Harmony pages with AI-specific features
- All styling uses Tailwind CSS classes
- No inline styles are used
- Consistent use of HeySalad brand colors throughout

---

Last Updated: February 20, 2026
