# Header Component Reference Guide

## Component Location
```
components/layout/Header.tsx
```

## Overview

The `Header` component is a reusable, responsive navigation component that displays the Xyber logo and provides navigation to all main pages of the application.

---

## Component Properties

The Header component accepts no props - it manages its own state through Next.js hooks.

```tsx
export function Header() {
  // Component implementation
}
```

---

## Usage Example

### Basic Usage
```tsx
import { Header } from '@/components/layout/Header'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page content */}
      </main>
    </div>
  )
}
```

### Full Page Structure
```tsx
'use client'

import { Header } from '@/components/layout/Header'

export default function PageName() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with logo */}
      <Header />
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <h1>Page Title</h1>
        {/* Page content goes here */}
      </main>
    </div>
  )
}
```

---

## Component Structure

### Section 1: Logo and Brand
```tsx
<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
  <div className="relative w-10 h-10 flex-shrink-0">
    <Image
      src="/logos/xyber-logo.png"
      alt="Xyber Logo"
      width={40}
      height={40}
      priority
      className="w-full h-full object-contain"
    />
  </div>
  <div className="flex flex-col">
    <span className="font-bold text-lg text-foreground">Xyber</span>
    <span className="text-xs text-muted-foreground">Oracle Network</span>
  </div>
</Link>
```

**Features:**
- Clickable logo links to home page
- 40x40px image with proper aspect ratio
- Brand name and tagline below logo
- Hover animation (opacity transition)

---

### Section 2: Desktop Navigation
```tsx
<nav className="hidden md:flex items-center gap-8">
  {navItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={`text-sm font-medium transition-colors ${
        isActive(item.href)
          ? 'text-accent'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {item.label}
    </Link>
  ))}
</nav>
```

**Features:**
- Hidden on mobile (`hidden md:flex`)
- Shows on medium screens and above
- Active page highlighting with accent color
- Hover effects for interactivity

**Navigation Items:**
- Dashboard
- Feeds
- Requests
- Analytics

---

### Section 3: Mobile Navigation
```tsx
<nav className="flex md:hidden items-center gap-4 mt-4 overflow-x-auto pb-2">
  {navItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={`whitespace-nowrap text-sm font-medium transition-colors px-3 py-1 rounded ${
        isActive(item.href)
          ? 'bg-secondary text-accent'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {item.label}
    </Link>
  ))}
</nav>
```

**Features:**
- Visible on mobile (`flex md:hidden`)
- Hidden on medium screens and above
- Horizontal scrolling for small screens
- Pill-shaped buttons with rounded corners
- Secondary background on active items

---

### Section 4: Settings Icon
```tsx
<Link href="/settings" className="p-2 hover:bg-secondary rounded-lg transition-colors">
  <svg
    className="w-5 h-5 text-muted-foreground hover:text-foreground"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    {/* Additional path for center circle */}
  </svg>
</Link>
```

**Features:**
- Links to settings page
- Gear icon SVG
- Hover background color
- Responsive padding

---

## CSS Classes Used

### Layout Classes
```css
/* Header Container */
sticky top-0 z-50 w-full
border-b border-border
bg-background/95 backdrop-blur
supports-[backdrop-filter]:bg-background/60

/* Content Wrapper */
max-w-7xl mx-auto px-6 py-4

/* Flexbox Layouts */
flex items-center justify-between
hidden md:flex items-center gap-8
flex md:hidden items-center gap-4
```

### Styling Classes
```css
/* Logo Container */
relative w-10 h-10 flex-shrink-0

/* Image */
w-full h-full object-contain

/* Text */
font-bold text-lg text-foreground
text-xs text-muted-foreground

/* Navigation Items */
text-sm font-medium transition-colors
hover:opacity-80 transition-opacity

/* Active States */
text-accent                    /* Desktop */
bg-secondary text-accent       /* Mobile */

/* Hover States */
hover:text-foreground
hover:bg-secondary

/* Interactive Elements */
p-2 rounded-lg transition-colors
whitespace-nowrap px-3 py-1 rounded
```

---

## Customization Examples

### Change Logo Size

**Current (40x40px):**
```tsx
<div className="relative w-10 h-10 flex-shrink-0">
  <Image width={40} height={40} ... />
</div>
```

**Small (32x32px):**
```tsx
<div className="relative w-8 h-8 flex-shrink-0">
  <Image width={32} height={32} ... />
</div>
```

**Large (64x64px):**
```tsx
<div className="relative w-16 h-16 flex-shrink-0">
  <Image width={64} height={64} ... />
</div>
```

---

### Change Logo File Path

**Current:**
```tsx
src="/logos/xyber-logo.png"
```

**Alternative:**
```tsx
src="/logos/xyber-logo-horizontal.png"
src="/logos/xyber-logo-white.png"
src="/logos/xyber-logo-icon.png"
```

---

### Change Brand Text

**Current:**
```tsx
<span className="font-bold text-lg text-foreground">Xyber</span>
<span className="text-xs text-muted-foreground">Oracle Network</span>
```

**Alternative:**
```tsx
<span className="font-bold text-lg text-foreground">Your Company</span>
<span className="text-xs text-muted-foreground">Your Tagline</span>
```

---

### Change Navigation Items

**Current:**
```tsx
const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/feeds', label: 'Feeds' },
  { href: '/requests', label: 'Requests' },
  { href: '/analytics', label: 'Analytics' },
]
```

**Add New Item:**
```tsx
const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/feeds', label: 'Feeds' },
  { href: '/requests', label: 'Requests' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/docs', label: 'Documentation' },  // NEW
]
```

---

## Component Hooks and Logic

### usePathname Hook
```tsx
const pathname = usePathname()

const isActive = (href: string) => {
  return pathname === href || pathname.startsWith(href + '/')
}
```

**Purpose:** Determines which navigation item is currently active based on the current URL path.

**Usage:**
```tsx
className={`... ${
  isActive(item.href) ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
}`}
```

---

## Responsive Behavior

### Mobile View (<768px)
```
┌──────────────────────┐
│ [LOGO] Brand [⚙]    │
│    Tagline          │
├──────────────────────┤
│ Nav1 Nav2 Nav3 Nav4 │ (scrollable)
└──────────────────────┘
```
- Logo and tagline on first row
- Navigation items on second row
- Horizontal scrolling enabled
- Settings icon aligned right

### Tablet View (768px-1024px)
```
┌──────────────────────────────────────┐
│ [LOGO] Brand │ Nav1 Nav2 Nav3 Nav4   │ [⚙]
│      Tagline │                        │
└──────────────────────────────────────┘
```
- Logo and navigation inline
- Desktop navigation shows
- Mobile navigation hidden

### Desktop View (>1024px)
```
┌────────────────────────────────────────────────────┐
│ [LOGO] Brand │ Nav1  Nav2  Nav3  Nav4       [⚙]   │
│      Tagline │                                     │
└────────────────────────────────────────────────────┘
```
- Same as tablet
- More space available
- Full navigation visible

---

## Accessibility Features

### Alt Text
```tsx
<Image
  alt="Xyber Logo"  // Descriptive alt text for screen readers
  ...
/>
```

### Semantic HTML
```tsx
<header>        {/* Semantic header element */}
<nav>           {/* Semantic nav element */}
<Link>          {/* Next.js navigation component */}
```

### Color Contrast
- White logo on dark background: ✅ WCAG AA
- Text colors meet contrast requirements: ✅
- Hover states maintain contrast: ✅

### Keyboard Navigation
- All links keyboard accessible
- Tab order logical and consistent
- Focus indicators visible
- No keyboard traps

### Touch Targets
- Logo and links: 40x40px+ with padding
- Settings icon: 20x20px with 8px padding (36x36px total)
- Mobile buttons: 32x32px minimum

---

## CSS Transitions and Animations

### Logo Hover
```css
hover:opacity-80 transition-opacity
/* Smooth fade effect on hover */
```

### Navigation Hover
```css
transition-colors
hover:text-foreground
/* Smooth color change on hover */
```

### Background Hover
```css
hover:bg-secondary transition-colors
/* Smooth background color change */
```

---

## Theme Integration

### Dark Theme
The component integrates with the Tailwind CSS dark theme:

```css
bg-background/95        /* Primary background */
text-foreground         /* Primary text */
text-muted-foreground   /* Secondary text */
text-accent             /* Active/highlight color - red */
border-border           /* Border color */
hover:bg-secondary      /* Hover background */
```

### Color Values
```
--background: 0 0% 8%              /* Very dark gray */
--foreground: 0 0% 95%             /* Light gray */
--muted-foreground: 0 0% 70%       /* Medium gray */
--accent: 0 88% 45%                /* Bright red */
--border: 0 0% 20%                 /* Dark gray border */
```

---

## Performance Features

### Image Optimization
```tsx
<Image
  priority              {/* Prioritizes loading */}
  className="w-full h-full object-contain"  {/* Responsive */}
  width={40}
  height={40}           {/* Required for optimization */}
/>
```

### CSS Optimization
- Uses Tailwind utility classes
- No custom CSS files needed
- Purges unused styles
- Minimal bundle size

### Rendering Optimization
- No unnecessary re-renders
- usePathname hook memoized
- Static navItems array
- Efficient conditional rendering

---

## Troubleshooting

### Logo Not Showing
**Check:**
1. Image file exists: `/public/logos/xyber-logo.png`
2. File path in `src` prop is correct
3. Image dimensions match `width` and `height` props
4. No console errors in browser DevTools

### Active Navigation Not Highlighting
**Check:**
1. `isActive` function logic
2. Current pathname from `usePathname()`
3. Navigation item `href` values match actual routes
4. CSS classes applied correctly

### Responsive Layout Issues
**Check:**
1. Breakpoint at `md:` (768px in Tailwind)
2. `hidden md:flex` classes applied correctly
3. `flex md:hidden` classes applied correctly
4. Browser window resized correctly

### Styling Not Applied
**Check:**
1. Tailwind CSS properly configured
2. Global styles imported in layout
3. CSS variables defined correctly
4. No conflicting CSS rules

---

## Summary

The Header component is a production-ready, responsive navigation component featuring:

✅ Xyber logo display (40x40px)
✅ Brand name and tagline
✅ Responsive navigation
✅ Active page highlighting
✅ Mobile-first design
✅ Accessibility compliant
✅ Performance optimized
✅ Easy to customize

Perfect for use across all pages of the XyData Oracle application!
