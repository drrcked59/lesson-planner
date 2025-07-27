# Apple-like Font System

This app uses **Inter** font from Google Fonts to provide an Apple-like experience across all platforms.

## Font Stack

The font stack is designed to provide the best Apple-like experience on all platforms:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Priority:
1. **Inter** - Primary Apple-like font (Google Fonts)
2. **-apple-system** - San Francisco on macOS/iOS
3. **BlinkMacSystemFont** - San Francisco on older macOS
4. **Segoe UI** - Windows system font
5. **Roboto** - Android system font
6. **Helvetica Neue** - Fallback
7. **Arial** - Universal fallback
8. **sans-serif** - System default

## Why Inter?

- **Apple-like design**: Inter was designed to be very similar to Apple's SF Pro
- **Cross-platform**: Works on Windows, Mac, Linux, mobile
- **Variable font**: Supports different weights and optical sizes
- **Excellent readability**: Optimized for UI and screen display
- **Free and open source**: No licensing issues

## Features

### Font Smoothing
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Optical Size Optimization
```css
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
font-variation-settings: 'opsz' 32;
```

### Letter Spacing
```css
letter-spacing: -0.025em; /* Apple-like tight spacing */
```

## Usage

### CSS Classes
- `.font-apple` - Full Apple-like font stack
- `.font-inter` - Inter font only

### Tailwind Classes
- `font-apple` - Full Apple-like font stack
- `font-inter` - Inter font only

### Component Classes
All component classes (`.btn-primary`, `.card`, etc.) automatically use the Apple-like font stack.

## Testing

Look for the blue "Font Test" indicator at the top of the app. It should display in Inter font on all platforms.

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Performance

- Fonts are loaded from Google Fonts CDN
- Preconnect links for faster loading
- Font display: swap for better performance
- Only necessary weights loaded (300, 400, 500, 600, 700) 