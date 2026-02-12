# Logo Placement and Styling Guide

## Visual Hierarchy and Placement

### Header Navigation - Primary Placement

The Xyber logo is prominently displayed in the **header/navigation area** of every page, establishing immediate brand recognition.

```
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO + TEXT] │  Dashboard  Feeds  Requests  Analytics  [⚙]    │
│ Xyber         │                                                  │
│ Oracle Network│                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Position Specifications:

**Desktop Layout (>768px)**
```
Max-width: 7xl (80rem)
Container: Sticky header with backdrop blur
Padding: 1rem (16px) vertical, 1.5rem (24px) horizontal
Logo Section:
  - Logo Size: 40x40px
  - Spacing from edge: 24px
  - Gap between logo and text: 12px (gap-3)
  - Brand name font size: 18px (text-lg)
  - Subtitle font size: 12px (text-xs)
Navigation: 32px gap (gap-8) between menu items
```

**Mobile Layout (<768px)**
```
Logo Size: 40x40px (unchanged)
Brand Name: Fully displayed
Navigation: Below logo on horizontal scroll
Menu Items: 12px gap (gap-4)
Settings Icon: Right aligned
```

#### Layout Structure:

```
Header
├── Logo Container (sticky)
│   ├── Image (40x40px)
│   └── Text Column
│       ├── "Xyber" (font-bold, text-lg)
│       └── "Oracle Network" (text-xs, muted)
├── Desktop Navigation
│   ├── Dashboard
│   ├── Feeds
│   ├── Requests
│   └── Analytics
├── Mobile Navigation
│   └── Horizontal scrollable items
└── Settings Icon
```

## Responsive Breakpoints

### Desktop View (≥1024px)
- Logo: 40x40px
- Header height: ~60px
- Navigation inline with logo
- Full spacing maintained

### Tablet View (768px - 1023px)
- Logo: 40x40px
- Header height: ~60px
- Navigation slightly condensed
- Settings icon present

### Mobile View (<768px)
- Logo: 40x40px (optimal touch target with padding)
- Header height: ~60px + navigation bar
- Navigation in secondary row
- Settings icon present
- Full text visible to reduce cognitive load

## Color and Theme Integration

### Logo Display Context

**Dark Theme (Primary)**
```
Background: rgb(13, 13, 13) - background
Logo Color: White/Light gray on transparent PNG
Accent: #EF4444 (red) for highlights
Text Color: rgb(243, 244, 246) - foreground
Muted Text: rgb(107, 114, 128) - muted-foreground
```

**Styling Applied:**
```css
/* Header Container */
border-b: 1px solid var(--border); /* 0 0% 20% */
background: rgb(var(--background) / 0.95);
backdrop-filter: blur(12px);

/* Logo Link */
opacity: 1 (default)
opacity: 0.8 (on hover)
transition: opacity 150ms ease-in-out

/* Text */
"Xyber" - font-bold text-lg text-foreground
"Oracle Network" - text-xs text-muted-foreground
```

## Spacing and Layout Measurements

### Logo Alignment

```
Logo Container
├── Width: 40px
├── Height: 40px
├── Flex: shrink-0 (prevents scaling)
├── Border Radius: 8px (for component integrity)
└── Object-fit: contain (preserves aspect ratio)

Gap after logo: 12px (gap-3)

Text Column
├── "Xyber"
│   └── Font Size: 18px (text-lg)
│       Font Weight: 700 (font-bold)
│       Line Height: 1.5rem
├── "Oracle Network"
│   └── Font Size: 12px (text-xs)
│       Font Weight: 400
│       Line height: 1rem
└── Gap between lines: 0px (tight)
```

### Full Header Dimensions

| Element | Dimension | Notes |
|---------|-----------|-------|
| Logo Width | 40px | Constant |
| Logo Height | 40px | Constant |
| Logo Margin Right | 12px | Creates visual breathing room |
| Header Height | 60px | Fixed, includes padding |
| Left Padding | 24px | Max-width container padding |
| Right Padding | 24px | Max-width container padding |
| Top/Bottom Padding | 16px | Vertical centering |

## Implementation Details

### Current CSS Classes Used

```tsx
{/* Header Container */}
<header className="sticky top-0 z-50 w-full border-b border-border 
                    bg-background/95 backdrop-blur 
                    supports-[backdrop-filter]:bg-background/60">

{/* Content Wrapper */}
<div className="max-w-7xl mx-auto px-6 py-4">

{/* Logo Section */}
<Link href="/" className="flex items-center gap-3 hover:opacity-80 
                           transition-opacity">
  <div className="relative w-10 h-10 flex-shrink-0">
    <Image src="/logos/xyber-logo.png" alt="Xyber Logo"
           width={40} height={40} priority
           className="w-full h-full object-contain" />
  </div>
  <div className="flex flex-col">
    <span className="font-bold text-lg text-foreground">Xyber</span>
    <span className="text-xs text-muted-foreground">Oracle Network</span>
  </div>
</Link>

{/* Navigation */}
<nav className="hidden md:flex items-center gap-8">
  {/* Navigation items */}
</nav>

{/* Mobile Navigation */}
<nav className="flex md:hidden items-center gap-4 mt-4 overflow-x-auto pb-2">
  {/* Mobile navigation items */}
</nav>
```

## Accessibility Considerations

### Current Implementations

✅ **Alt Text**: `alt="Xyber Logo"` provides clear description
✅ **Color Contrast**: Logo white elements on dark background meet WCAG AA standards
✅ **Keyboard Navigation**: Logo link is keyboard accessible
✅ **Touch Targets**: 40x40px logo with surrounding padding exceeds 44x44px minimum
✅ **Semantic HTML**: Uses `<Link>` (Next.js navigation) for proper semantic meaning
✅ **Focus Indicators**: Browser default focus styles visible on keyboard navigation

### Additional Best Practices Applied

- Logo clickability clearly indicated through link styling
- Navigation items clearly labeled with descriptive text
- Settings icon is supplementary (not primary action)
- Mobile navigation doesn't hide essential branding

## Styling Customization

### To Adjust Logo Size

Modify the dimensions in Header.tsx:

```tsx
// Current: 40x40px
<div className="relative w-10 h-10 flex-shrink-0">
  <Image width={40} height={40} ... />
</div>

// For larger logos (64x64px):
<div className="relative w-16 h-16 flex-shrink-0">
  <Image width={64} height={64} ... />
</div>

// Tailwind width classes: w-8 (32px), w-10 (40px), w-12 (48px), w-16 (64px)
```

### To Adjust Spacing

Modify gap classes:

```tsx
// Current: gap-3 (12px)
<Link href="/" className="flex items-center gap-3">

// For larger spacing: gap-4 (16px) or gap-6 (24px)
<Link href="/" className="flex items-center gap-6">
```

### To Adjust Font Sizes

```tsx
// Brand name - current: text-lg (18px)
<span className="font-bold text-lg text-foreground">Xyber</span>

// Alternatives: text-base (16px), text-xl (20px)

// Tagline - current: text-xs (12px)
<span className="text-xs text-muted-foreground">Oracle Network</span>

// Alternatives: text-sm (14px), text-[11px]
```

## Cross-Page Consistency

The logo appears identically on all pages:
- ✅ Dashboard (`/dashboard`)
- ✅ Data Feeds (`/feeds`)
- ✅ Requests (`/requests`)
- ✅ Analytics (`/analytics`)
- ✅ Settings (`/settings`)
- ✅ Home Page (`/`)

This consistency is achieved through the centralized `Header` component, ensuring brand coherence across the entire application.

## Mobile-First Responsive Design

The header implements mobile-first responsive patterns:

```tsx
// Navigation: Hidden by default, shown on md breakpoint
<nav className="hidden md:flex items-center gap-8">

// Mobile Nav: Shown by default, hidden on md breakpoint
<nav className="flex md:hidden items-center gap-4 mt-4">

// Breakpoint: md = 768px (Tailwind default)
```

## Summary

The Xyber logo is seamlessly integrated into the application with:

- **Optimal Placement**: Sticky header for constant visibility
- **Responsive Design**: Perfect appearance on all device sizes
- **Accessibility**: WCAG compliant with proper contrast and touch targets
- **Performance**: Optimized image delivery via Next.js Image component
- **Consistency**: Centralized component ensures uniform appearance
- **Professional Styling**: Sophisticated dark theme integration with red accents

All styling is managed through Tailwind CSS utility classes, making it easy to customize and maintain across the entire application.
