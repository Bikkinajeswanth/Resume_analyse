# Professional Dark Mode Theme System

## Overview

A production-grade dark mode implementation designed for enterprise SaaS applications. The theme system prioritizes eye comfort, readability, and professional appearance suitable for daily use by developers, recruiters, and ATS platforms.

## Design Philosophy

### Color Strategy
- **Deep Charcoal/Slate Backgrounds**: `#0f172a` (not pure black) - reduces eye strain
- **Soft Off-White Text**: `#f1f5f9` - comfortable for extended reading
- **Muted Accents**: Desaturated brand colors for dark mode
- **No Neon Colors**: Professional, enterprise-appropriate palette
- **No Gradients**: Clean, flat design approach

### Contrast & Readability
- **WCAG AA Compliant**: All text meets minimum contrast ratios
- **Primary Text**: 4.5:1+ contrast ratio
- **Secondary Text**: 4.0:1+ contrast ratio
- **Interactive Elements**: Clear hover/focus states

## Color Variables

### Light Mode
```css
--color-bg-primary: #ffffff;      /* White */
--color-bg-secondary: #f9fafb;    /* Gray-50 */
--color-text-primary: #111827;     /* Gray-900 */
--color-text-secondary: #4b5563;   /* Gray-600 */
--color-border-primary: #e5e7eb;   /* Gray-200 */
```

### Dark Mode
```css
--color-bg-primary: #0f172a;      /* Deep slate */
--color-bg-secondary: #1e293b;    /* Slate */
--color-bg-tertiary: #334155;     /* Lighter slate (cards) */
--color-text-primary: #f1f5f9;     /* Soft off-white */
--color-text-secondary: #cbd5e1;   /* Muted gray */
--color-border-primary: #334155;   /* Subtle borders */
```

## Component Styling

### Cards
- **Light**: White background with gray borders
- **Dark**: `#334155` background (lighter than main background)
- **Hover**: Subtle background lightening and border enhancement

### Buttons
- **Primary**: Brand color with proper contrast
- **Secondary**: Transparent with border
- **Hover**: Slight lift effect (translateY)
- **Focus**: Visible ring with offset

### Input Fields
- **Light**: White background
- **Dark**: `#334155` background
- **Focus**: Ring with brand color
- **Placeholder**: Muted text color

### Navigation
- **Links**: Muted text, brand color on hover/active
- **Active State**: Brand background tint
- **Hover**: Subtle background change

## Implementation Details

### Theme Application
- Uses `.dark` class on root element
- CSS variables automatically switch
- Smooth transitions (300ms cubic-bezier)
- No layout shifts during theme change

### Performance
- CSS variables for instant switching
- No JavaScript color calculations
- Minimal repaints/reflows
- Hardware-accelerated transitions

### Accessibility
- Focus rings visible in both themes
- High contrast ratios maintained
- Keyboard navigation support
- Screen reader friendly

## Usage Examples

### Basic Component
```jsx
<div className="card">
  <h2 className="text-gray-900 dark:text-slate-100">Title</h2>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Button
```jsx
<button className="btn-primary">Action</button>
<button className="btn-secondary">Cancel</button>
```

### Input
```jsx
<input className="input-field" placeholder="Enter text" />
```

## Best Practices

1. **Always use CSS variables** for colors
2. **Test in both themes** before deploying
3. **Maintain contrast ratios** in dark mode
4. **Use semantic color names** (primary, secondary, etc.)
5. **Avoid hardcoded colors** in components

## Theme Toggle

The theme toggle component:
- Located in navbar
- Animated switch with icons
- Persists preference in localStorage
- Detects system preference on first visit

## Future Enhancements

- Custom theme colors per user
- High contrast mode option
- Reduced motion mode
- Theme-specific chart colors

---

**Last Updated**: December 2025  
**Version**: 2.0.0 (Production-Grade)

