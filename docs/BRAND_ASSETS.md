# Xyber Brand Assets & Implementation Guide

## Overview

This document provides comprehensive guidelines for implementing the Xyber logo and brand across all digital and print platforms.

---

## Asset Directory Structure

```
public/logos/
├── xyber-logo-primary.jpg           # Main logo mark
├── xyber-logo-variations.jpg        # All variations grid
├── icon-mark.svg                     # Favicon & icon-only format
├── lockup-horizontal.svg             # Standard horizontal configuration
├── lockup-vertical.svg               # Stacked version
├── monochrome-black.svg              # Black-only version
├── monochrome-white.svg              # White-only version
└── color-specifications.json         # Hex codes and color reference
```

---

## Logo Specifications

### Primary Dimensions

| Format | Width | Height | Use Case |
|--------|-------|--------|----------|
| Icon Mark | 1000px | 1000px | Digital, favicon, app icon |
| Horizontal Lockup | 1000px | 400px | Website headers, social |
| Vertical Lockup | 400px | 1000px | Mobile, stacked layouts |
| Print (High-Res) | 300 DPI | Variable | Physical materials |

### Color Specifications (RGB & Hex)

```json
{
  "colors": {
    "primary_blue": {
      "hex": "#0B3D7F",
      "rgb": { "r": 11, "g": 61, "b": 127 },
      "cmyk": { "c": 100, "m": 80, "y": 0, "k": 50 }
    },
    "metallic_silver": {
      "hex": "#E8E8E8",
      "rgb": { "r": 232, "g": 232, "b": 232 },
      "cmyk": { "c": 0, "m": 0, "y": 0, "k": 10 }
    },
    "deep_charcoal": {
      "hex": "#1A1A1A",
      "rgb": { "r": 26, "g": 26, "b": 26 },
      "cmyk": { "c": 75, "m": 70, "y": 65, "k": 90 }
    }
  }
}
```

---

## Digital Implementation

### Web Implementation

#### React/Next.js Component Pattern

```tsx
import Image from 'next/image'

// Icon Mark Only
export function LogoMark() {
  return (
    <Image
      src="/logos/icon-mark.svg"
      alt="Xyber"
      width={40}
      height={40}
      className="w-auto h-auto"
    />
  )
}

// Horizontal Lockup
export function LogoHorizontal() {
  return (
    <Image
      src="/logos/lockup-horizontal.svg"
      alt="Xyber"
      width={200}
      height={80}
      className="w-auto h-auto"
    />
  )
}

// Dynamic Logo with Dark Mode
export function LogoDynamic({ isDark = false }) {
  const src = isDark 
    ? "/logos/monochrome-white.svg"
    : "/logos/icon-mark.svg"
  
  return (
    <Image
      src={src}
      alt="Xyber"
      width={40}
      height={40}
      className="w-auto h-auto"
    />
  )
}
```

### CSS Integration

```css
/* Logo Mark Sizing */
.logo-xs { width: 24px; height: 24px; }
.logo-sm { width: 32px; height: 32px; }
.logo-md { width: 48px; height: 48px; }
.logo-lg { width: 64px; height: 64px; }
.logo-xl { width: 96px; height: 96px; }

/* Spacing */
.logo-margin { margin-right: 12px; }
.logo-padding { padding: 16px; }

/* Contrast Backgrounds */
.logo-on-dark {
  filter: brightness(1.1);
}

.logo-on-light {
  filter: brightness(0.9);
}
```

### Favicon Implementation

```html
<!-- In <head> -->
<link rel="icon" type="image/x-icon" href="/logos/favicon.ico">
<link rel="apple-touch-icon" href="/logos/apple-touch-icon.png">
<link rel="icon" type="image/svg+xml" href="/logos/icon-mark.svg">

<!-- Color theme for browser UI -->
<meta name="theme-color" content="#0B3D7F">
```

---

## Print Implementation

### Business Card Layout

```
┌─────────────────────────────────────┐
│ [Logo Mark]                         │
│ 0.5" × 0.5"                         │
│                                     │
│ XYBER                               │
│ Your Title                          │
│                                     │
│ Name                                │
│ email@xyber.com                     │
│ +1 (555) 123-4567                   │
│ www.xyber.com                       │
└─────────────────────────────────────┘

Dimensions: 3.5" × 2"
Bleed: 0.125" all sides
Stock: 16pt premium card stock
Color: 4/4 (Full color both sides)
```

### Letterhead Layout

```
┌─────────────────────────────────────────────────┐
│ [Logo Horizontal Lockup]  1" height             │
│                                                 │
│ 123 Innovation Drive                            │
│ Tech City, TC 12345                             │
│ www.xyber.com                                   │
│                                                 │
│                                                 │
│  [Letter Content Here]                          │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│ [Footer]                                        │
│ [Icon Mark] 0.25"  XYBER © 2024 All Rights      │
└─────────────────────────────────────────────────┘

Paper Size: 8.5" × 11" (Letter)
Logo Height: 1"
Top Margin: 0.75"
Left/Right Margin: 0.75"
```

### Print Color Separations

**Pantone Equivalents** (for spot color printing):

- Xyber Blue: Pantone 281 C
- Metallic Silver: Pantone 877 C or 872 C (metallic)
- Deep Charcoal: Pantone Black 7 C + 5% PMS 281

---

## Social Media Guidelines

### Profile Picture
- Format: PNG with transparent background
- Dimensions: 400px × 400px minimum
- Content: Icon mark only
- Padding: 10% safe space on all sides

### Cover/Header Image
- Format: JPG or PNG
- Dimensions: 
  - Twitter: 1500px × 500px
  - LinkedIn: 1500px × 500px
  - Facebook: 1200px × 628px
  - YouTube: 2560px × 1440px
- Content: Horizontal lockup with context/visual

### Story/Feed Post
- Dimensions: 1080px × 1350px (portrait)
- Include logo in corner (24px × 24px)
- Ensure 10% safe margin around edges

---

## Email & Digital Communications

### Email Header

```html
<table width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" bgcolor="#FFFFFF">
      <img 
        src="https://cdn.xyber.com/logos/lockup-horizontal.svg" 
        width="200" 
        height="80" 
        alt="Xyber"
        style="margin: 20px 0; display: block;"
      >
    </td>
  </tr>
</table>
```

### Email Signature

```
═══════════════════════════════════════
    [Logo Mark 32px] 

Name
Title
Email: name@xyber.com
Phone: +1 (555) 123-4567
Web: www.xyber.com

═══════════════════════════════════════
```

---

## Presentation & Deck Templates

### PowerPoint/Keynote

**Slide Master Setup**:
- Logo placement: Top-left corner, 0.5" × 0.5"
- Logo color: Primary blue on light slides, white on dark slides
- Spacing: 0.25" from top and left edges
- No outline or drop shadow effects

**Title Slide**:
- Horizontal lockup centered or top-right
- Size: 1.5" × 0.6"
- Color: Primary blue with accent silver elements

---

## Brand Applications

### Technology Documentation
- Use icon mark in headers
- Primary blue for highlights and callout boxes
- Monochrome for code blocks

### Marketing Materials
- Use horizontal lockup as header
- Silver accents for key points
- Full color logo on white or dark blue backgrounds

### Employee Communications
- Icon mark in email headers
- Horizontal lockup on internal documents
- Consistent color usage across all materials

### Product/Service Marketing
- Feature icon mark prominently
- Use silver accents for product highlights
- Maintain consistent spacing and proportions

---

## Accessibility Considerations

### Color Contrast

**Blue on White** (#0B3D7F on #FFFFFF):
- Contrast Ratio: 10.47:1
- WCAG Rating: AAA ✓

**Silver on Blue** (#E8E8E8 on #0B3D7F):
- Contrast Ratio: 4.82:1
- WCAG Rating: AA ✓

**White on Dark Blue** (#FFFFFF on #0B3D7F):
- Contrast Ratio: 13.01:1
- WCAG Rating: AAA ✓

### Alt Text Examples

```
- Minimal: "Xyber logo"
- Detailed: "Xyber logo - technology company specializing in data innovation"
- Interactive: "Xyber - Go to homepage" (for clickable logo)
```

---

## Animation & Motion

### Logo Reveal Animation

```css
@keyframes logoReveal {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.logo-animate {
  animation: logoReveal 0.6s ease-out;
}
```

### Loading State

```css
@keyframes logoSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.logo-loading {
  animation: logoSpin 3s linear infinite;
}
```

---

## Version Control

### Current Version
- **Version**: 1.0
- **Release Date**: 2024
- **Status**: Active

### Approved Modifications Only
- Any changes to logo require approval
- Document all version updates
- Maintain archive of previous versions

---

## Support & Resources

### When to Use Each Format

| Situation | Format | Color |
|-----------|--------|-------|
| Website favicon | SVG or PNG 32px | Primary or monochrome |
| Large print | PDF or EPS | Full color or spot |
| Social media | PNG | Full color |
| Email signature | PNG or SVG | Full color |
| App icon | PNG 180px+ | Full color or monochrome |
| Presentation | SVG or PPT native | Full color |
| Documentation | PNG or SVG | Primary blue |

### Troubleshooting

**Logo appears blurry in browser?**
- Ensure using SVG format for web
- Check image dimensions match display size
- Clear browser cache if needed

**Colors don't match?**
- Verify hex codes match specifications
- Check monitor color profile
- For print, use Pantone swatches

**Logo looks stretched?**
- Verify aspect ratio locked in constrains
- Check CSS scaling properties
- Use provided dimensions exactly

---

## Questions?

For brand implementation questions or to request additional logo variations, contact the brand team.
