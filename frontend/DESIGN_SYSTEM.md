# BeautyHub Design System - Jumia Marketplace Style

This document outlines the visual design system used for BeautyHub, inspired by the clean, functional marketplace aesthetic of Jumia Kenya.

## Color Palette

### Primary Colors
- **Primary Orange**: `#F68B1E`
  - Used for: CTA buttons, highlights, active states, badges, accents
  - Text color on orange: White/Primary-foreground
  - This is the dominant brand color

### Neutral Colors
- **Background**: `#ffffff` (white)
- **Card**: `#ffffff` (white - clean, minimal)
- **Foreground (Text)**: `#313133` (dark gray - primary text)
- **Secondary Text**: `#75757A` (medium gray - muted text)
- **Borders**: `#EDEDED` (light gray - very subtle)
- **Input/Muted**: `#f5f5f5` (off-white - backgrounds)
- **Strikethrough**: `#B3B3B3` (light gray - old prices)

### Dark Mode
- **Background**: `#1a1a1a`
- **Card**: `#2a2a2a`
- **Border**: `#3a3a3a`
- **Text**: `#e0e0e0`

## Design Elements

### Border Radius
- **Small**: `4px` (0.375rem)
- Used for: Most components, buttons, badges, cards
- Philosophy: Slight modern softness, NOT rounded/playful
- Consistent with commercial marketplace aesthetic

### Shadows
```css
box-shadow: 0 2px 4px rgba(0,0,0,0.05);
```
- Very subtle shadows for depth
- Used on: Product cards, filter panel, testimonials
- Enhances separation without being heavy

### Box Styling
- Solid white backgrounds - NO gradients, NO glass effects
- Light, barely visible borders (1px #EDEDED)
- Clean spacing, structured layout
- Commercial, practical feeling

## Typography

### Font Weight Usage
- **Bold (700)**: Prices, headings, important data
- **Semibold (600)**: Button text, category names
- **Medium (500)**: Product titles, section headers
- **Regular (400)**: Body text, descriptions

### Sizes
- **Product Title**: 14-16px (font-medium/font-semibold)
- **Price**: Bold, slightly larger than title
- **Discount %**: Smaller font, bold, white on orange badge
- **Body Text**: 14px minimum for readability

## Components

### Product Cards
- White background with 1px border (#EDEDED)
- Subtle shadow: `0 2px 4px rgba(0,0,0,0.05)`
- Small rounded corners (4px)
- Hover: Slight shadow increase, no scale transform
- Price: Bold and prominent
- Discount badge: Orange background with white text, small radius

### Buttons
- **Primary**: Orange (#F68B1E) background, white text, 4px radius
- **Secondary**: White background, orange border, orange text
- Hover: Slightly darker orange (not much change)
- Font weight: Semibold (600)
- No shadows on buttons

### Category Buttons
- Border style (not filled)
- Selected: Orange border (2px), light orange background (#F68B1E/5)
- Unselected: Light gray border (#EDEDED)
- Rounded: 4px
- Hover effect on unselected

### Filters Panel
- White background with border
- Subtle shadow for separation
- Category links: Active state = orange background + white text
- Small rounded corners (4px)

### Bottom Navigation
- Fixed position on mobile
- Subtle top shadow
- Active item: Orange text color (no background fill)
- Icons: 24px size
- Height: 64px (4rem)

### Header
- Clean white background
- Subtle bottom border
- Logo: Orange square with white letter (4px radius)
- Cart badge: Orange background, white text, small radius

## Layout Principles

### Grid System
- **Desktop**: 4 products per row (with padding)
- **Tablet**: 3 products per row
- **Mobile**: 2 products per row (shows more items per scroll)
- Gap: 12px (mobile), 24px (desktop)

### Spacing
- 8px or 12px consistent spacing
- Grid-based, no arbitrary values
- Clean alignment

### Mobile-First
- Touch-friendly (44x44px minimum touch targets)
- Bottom navigation for easy thumb reach
- 2-column product grid (more items visible)
- Collapsible filters

## Design Personality

### What It IS
- Structured and functional
- Clean and organized
- Commerce-focused
- Professional and trustworthy
- Scalable and practical
- Safe and familiar

### What It ISN'T
- Luxury or high-end aesthetic
- Creative or playful
- Soft UI or rounded everywhere
- Gradient-heavy
- Complex visual effects
- Decorative elements

## Color Usage Examples

### Orange (#F68B1E)
- "Add to Cart" button
- Category filter active state
- Discount badge background
- Active navigation item
- Logo square background
- Promo banner background

### Light Gray (#EDEDED)
- Card borders
- Filter dividers
- Light separations

### Dark Gray (#313133)
- Primary text
- Button text (when not on orange)
- Headings

### Medium Gray (#75757A)
- Secondary text
- "In stock" indicators
- Muted content

## Accessibility

### Contrast
- Orange (#F68B1E) on white: Sufficient contrast
- Dark gray (#313133) on white: Excellent contrast
- All text meets WCAG AA standards

### Typography
- Minimum 14px for body text
- Line height 1.4-1.6 for readability
- Semantic HTML structure

### Interactive Elements
- Minimum 44x44px touch targets
- Clear focus states
- Visible hover states

---

## Implementation Notes

- All color values use CSS custom properties (--primary, --foreground, etc.)
- Tailwind classes applied for consistency
- Border radius: 0.375rem (6px) as baseline
- Shadow used sparingly for visual hierarchy
- No complex gradients or special effects
- Maintain commercial, structured feeling throughout
