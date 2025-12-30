# Enterprise Design System Documentation

## Overview

This document outlines the enterprise-grade design system implemented for the Resume Analyzer application. The design follows ATS/HR-tech industry standards with a focus on professionalism, accessibility, and consistency.

## Design Principles

1. **Minimalist & Professional**: Clean interfaces without flashy elements
2. **Neutral Color Palette**: White, gray, slate with blue accents
3. **Subtle Depth**: Light shadows only, no heavy gradients
4. **High Readability**: Optimized typography and contrast
5. **Accessibility First**: WCAG AA compliant focus states and contrast ratios

## Color System

### Primary Colors (Blue)
- `primary-50` to `primary-900`: Professional blue scale
- Primary action color: `primary-600` (#2563eb)
- Hover state: `primary-700` (#1d4ed8)

### Neutral Grays
- `gray-50` to `gray-900`: Complete gray scale
- Background: `gray-50` (#f9fafb)
- Text primary: `gray-900` (#111827)
- Text secondary: `gray-600` (#4b5563)
- Borders: `gray-200` (#e5e7eb)

### Semantic Colors
- Success: `green-600` (#10b981)
- Warning: `amber-500` (#f59e0b)
- Error: `red-600` (#ef4444)
- Info: `blue-600` (#3b82f6)

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
```

### Scale
- **H1**: 2.25rem (36px) - Bold, line-height: 1.25
- **H2**: 1.875rem (30px) - Bold, line-height: 1.25
- **H3**: 1.5rem (24px) - Semibold, line-height: 1.25
- **H4**: 1.25rem (20px) - Semibold
- **Body**: 1rem (16px) - Normal, line-height: 1.75
- **Small**: 0.875rem (14px) - Normal, line-height: 1.5

### Font Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing System

Based on 8px grid system:
- `spacing-1`: 4px
- `spacing-2`: 8px
- `spacing-4`: 16px
- `spacing-6`: 24px
- `spacing-8`: 32px
- `spacing-12`: 48px
- `spacing-16`: 64px

## Component Library

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">Action</button>
```
- Background: `primary-600`
- Hover: `primary-700` with subtle lift
- Focus: Ring with offset
- Height: 2.5rem minimum

#### Secondary Button
```jsx
<button className="btn-secondary">Cancel</button>
```
- Background: White
- Border: `gray-300`
- Hover: `gray-50` background

#### Danger Button
```jsx
<button className="btn-danger">Delete</button>
```
- Red variant for destructive actions

### Cards

```jsx
<div className="card">Content</div>
<div className="card card-compact">Compact</div>
<div className="card card-spacious">Spacious</div>
```
- Background: White
- Border: `gray-200`
- Shadow: Subtle (`shadow-sm`)
- Border radius: `xl` (1rem)
- Padding: 1.5rem (default)

### Input Fields

```jsx
<input className="input-field" type="text" />
<textarea className="input-field" />
```
- Height: 2.75rem minimum
- Border: `gray-300`
- Focus: `primary-500` ring
- Hover: Darker border

### Badges/Tags

```jsx
<span className="badge badge-primary">Label</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-gray">Neutral</span>
```

### Navigation Links

```jsx
<Link className="nav-link">Dashboard</Link>
<Link className="nav-link nav-link-active">Active</Link>
```
- Hover: Background color change
- Active: `primary-600` text with `primary-50` background

## Layout Patterns

### Section Header
```jsx
<div className="section-header">
  <h2 className="section-title">Title</h2>
  <p className="section-description">Description</p>
</div>
```

### Empty State
```jsx
<div className="empty-state">
  <div className="empty-state-icon">Icon</div>
  <h3 className="empty-state-title">No items</h3>
  <p className="empty-state-description">Description</p>
</div>
```

### Stat Cards
```jsx
<div className="stat-card">
  <div>
    <div className="stat-value">85%</div>
    <div className="stat-label">Match Score</div>
  </div>
</div>
```

## Shadows

- `shadow-xs`: Minimal depth
- `shadow-sm`: Cards (default)
- `shadow-md`: Hover states
- `shadow-lg`: Modals, dropdowns
- `shadow-xl`: Large overlays

## Transitions

- Fast: 150ms (micro-interactions)
- Base: 200ms (default)
- Slow: 300ms (complex animations)

## Accessibility Features

1. **Focus States**: Visible ring with offset
2. **Contrast Ratios**: WCAG AA compliant
3. **Keyboard Navigation**: Full support
4. **Screen Readers**: Semantic HTML
5. **Color Independence**: Not relying solely on color

## Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Usage Guidelines

### Do's ✅
- Use consistent spacing (4px grid)
- Maintain color hierarchy
- Apply focus states to interactive elements
- Use semantic HTML
- Test accessibility

### Don'ts ❌
- Don't use gradients (except subtle backgrounds)
- Don't use neon colors
- Don't skip focus states
- Don't use arbitrary spacing values
- Don't override component styles unnecessarily

## Reusable Patterns

### Form Layout
```jsx
<div className="space-y-6">
  <div>
    <label>Field Label</label>
    <input className="input-field" />
  </div>
</div>
```

### Card Grid
```jsx
<div className="grid md:grid-cols-3 gap-6">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

### Button Group
```jsx
<div className="flex gap-4">
  <button className="btn-primary">Primary</button>
  <button className="btn-secondary">Secondary</button>
</div>
```

## Future Enhancements

- Dark mode support
- Additional component variants
- Animation library
- Icon system integration
- Design tokens export

---

**Last Updated**: December 2025
**Version**: 1.0.0

