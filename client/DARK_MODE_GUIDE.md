# Dark Mode Implementation Guide

## Overview

The application now supports both **Light Mode** and **Dark Mode** with automatic theme detection and user preference persistence.

## Features

✅ **Automatic Theme Detection**: Detects system preference on first visit  
✅ **Theme Persistence**: Saves user preference in localStorage  
✅ **Smooth Transitions**: All theme changes are animated  
✅ **Complete Coverage**: All components support both themes  
✅ **Accessible**: Maintains WCAG AA contrast in both modes  

## Color Scheme Changes

### Primary Color
- **Changed from**: Blue (`#2563eb`)
- **Changed to**: Indigo (`#4f46e5` / `#6366f1`)
- **Reason**: More modern, professional appearance suitable for enterprise ATS systems

### Light Mode Colors
- Background: `#f9fafb` (gray-50)
- Cards: `#ffffff` (white)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#4b5563` (gray-600)
- Borders: `#e5e7eb` (gray-200)

### Dark Mode Colors
- Background: `#111827` (gray-900)
- Cards: `#1f2937` (gray-800)
- Text Primary: `#f9fafb` (gray-50)
- Text Secondary: `#d1d5db` (gray-300)
- Borders: `#374151` (gray-700)

## Usage

### Theme Toggle Component

The theme toggle is automatically added to the navbar:

```jsx
import ThemeToggle from './components/ThemeToggle';

// Automatically appears in navbar
```

### Using Theme Context

```jsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### CSS Variables

All colors use CSS variables that automatically adapt:

```css
/* Light Mode */
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #111827;
}

/* Dark Mode */
.dark {
  --color-bg-primary: #1f2937;
  --color-text-primary: #f9fafb;
}
```

### Tailwind Dark Mode Classes

Use Tailwind's `dark:` prefix for dark mode styles:

```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

## Component Updates

All components have been updated to support dark mode:

- ✅ Navbar
- ✅ Landing Page
- ✅ Login/Register Pages
- ✅ Dashboard
- ✅ Cards
- ✅ Buttons
- ✅ Input Fields
- ✅ Badges
- ✅ Navigation Links

## Theme Persistence

The theme preference is saved in `localStorage` with the key `theme`:
- Values: `'light'` or `'dark'`
- Automatically restored on page load
- Falls back to system preference if no saved preference

## Implementation Details

### ThemeProvider

Located in `client/src/contexts/ThemeContext.jsx`:
- Manages theme state
- Handles localStorage persistence
- Applies theme class to `<html>` element
- Provides theme context to all components

### Theme Toggle

Located in `client/src/components/ThemeToggle.jsx`:
- Animated toggle switch
- Shows sun icon in light mode
- Shows moon icon in dark mode
- Accessible with ARIA labels

## Best Practices

### 1. Always Use CSS Variables

```css
/* ✅ Good */
color: var(--color-text-primary);

/* ❌ Bad */
color: #111827;
```

### 2. Use Tailwind Dark Mode Classes

```jsx
// ✅ Good
<div className="bg-white dark:bg-gray-800">

// ❌ Bad
<div className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
```

### 3. Test Both Themes

Always test components in both light and dark modes to ensure:
- Proper contrast ratios
- Readable text
- Visible borders
- Clear interactive elements

### 4. Maintain Consistency

Use the same color variables across all components:
- `--color-bg-primary` for card backgrounds
- `--color-text-primary` for main text
- `--color-border-primary` for borders

## Accessibility

### Contrast Ratios

Both themes maintain WCAG AA compliance:
- **Light Mode**: 4.5:1 minimum contrast
- **Dark Mode**: 4.5:1 minimum contrast

### Focus States

Focus rings are visible in both themes:
- Light Mode: Blue ring with white offset
- Dark Mode: Blue ring with dark offset

## Future Enhancements

- [ ] Theme-specific chart colors
- [ ] Custom theme colors per user
- [ ] High contrast mode option
- [ ] Theme transition animations

---

**Last Updated**: December 2025  
**Version**: 1.0.0

