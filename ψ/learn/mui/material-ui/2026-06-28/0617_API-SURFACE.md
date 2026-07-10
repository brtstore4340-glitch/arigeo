# Material-UI Public API Surface

**Version**: 9.1.2  
**Repository**: https://github.com/mui/material-ui  
**Documentation**: Generated 2026-06-28 from source analysis

## Overview

Material-UI (@mui/material) is a comprehensive React component library implementing Google's Material Design. It exports 60+ UI components, theming system, styling utilities, and hooks across multiple packages.

---

## 1. Core Packages

### @mui/material
Main package with Material Design components and theming.

### @mui/system
CSS utility system, styling engine, and layout primitives (Box, Grid, Stack).

### @mui/utils
Shared utilities and helpers used across MUI components.

### @mui/types
TypeScript type definitions and interfaces for MUI ecosystem.

### @mui/styled-engine
Underlying styled component engine (@emotion by default).

### @mui/icons-material
40K+ Material Design icons as React components.

### @mui/lab
Experimental components not yet in stable Material Design spec.

---

## 2. Public API Surface

### 2.1 Components (60 total)

#### Layout Components
- `Box` - Styled div with sx prop
- `Container` - Max-width wrapper
- `Grid` - 12-column grid system
- `Stack` - Flexbox layout helper
- `Paper` - Base surface component
- `Divider` - Visual separator

#### Navigation
- `AppBar` - Header bar
- `Toolbar` - Container within AppBar
- `Menu` / `MenuList` - Dropdown menu
- `MenuItem` - Menu item
- `Pagination` / `PaginationItem` - Page selection
- `Breadcrumbs` - Navigation path
- `Tabs` / `Tab` / `TabScrollButton` - Tab navigation
- `BottomNavigation` / `BottomNavigationAction` - Bottom navigation bar

#### Form Components
- `TextField` - Text input field (composite)
- `Input` / `InputBase` - Base text input
- `FilledInput` - Filled variant input
- `OutlinedInput` - Outlined variant input
- `FormControl` - Form field wrapper
- `FormLabel` / `FormGroup` - Form grouping
- `FormControlLabel` - Label with control
- `FormHelperText` - Helper/error text
- `Checkbox` - Checkbox input
- `Radio` / `RadioGroup` - Radio button
- `Switch` - Toggle switch
- `Select` / `NativeSelect` - Dropdown select
- `Slider` - Range slider
- `Rating` - Star rating
- `Autocomplete` - Searchable select
- `InputLabel` - Form input label
- `InputAdornment` - Input prefix/suffix icon

#### Data Display
- `Table` / `TableContainer` - Table structure
- `TableHead` / `TableBody` / `TableFooter` - Table sections
- `TableRow` / `TableCell` - Table cells
- `TablePagination` / `TablePaginationActions` - Table pagination
- `TableSortLabel` - Sortable column header
- `List` / `ListItem` / `ListItemButton` - List structure
- `ListItemIcon` / `ListItemText` / `ListItemAvatar` - List item parts
- `ListItemSecondaryAction` - Secondary action in list
- `ListSubheader` - List section header
- `Avatar` / `AvatarGroup` - User avatars
- `Badge` - Badge overlay
- `Chip` - Compact element
- `Icon` / `SvgIcon` - Icon containers
- `Card` / `CardMedia` / `CardContent` / `CardActions` / `CardHeader` / `CardActionArea` - Card structure
- `ImageList` / `ImageListItem` / `ImageListItemBar` - Image grid
- `Skeleton` - Loading placeholder

#### Feedback & Dialogs
- `Alert` / `AlertTitle` - Alert message
- `Dialog` / `DialogActions` / `DialogContent` / `DialogContentText` / `DialogTitle` - Modal dialog
- `Modal` - Base modal
- `Popover` / `Popper` - Positioning container
- `Snackbar` / `SnackbarContent` - Toast notification
- `CircularProgress` - Circular loader
- `LinearProgress` - Linear progress bar
- `Tooltip` - Hover tooltip
- `Backdrop` - Overlay backdrop

#### Buttons & Actions
- `Button` - Primary action button
- `ButtonBase` - Unstyled button base
- `ButtonGroup` - Button grouping
- `IconButton` - Icon button
- `Fab` - Floating action button
- `ToggleButton` / `ToggleButtonGroup` - Toggle group

#### Layout Containers
- `Accordion` / `AccordionSummary` / `AccordionDetails` / `AccordionActions` - Accordion
- `Drawer` / `SwipeableDrawer` - Slide-out panel
- `Collapse` - Collapse animation
- `Fade` / `Grow` / `Slide` / `Zoom` - Transition animations
- `Stepper` / `Step` / `StepLabel` / `StepButton` / `StepContent` / `StepConnector` / `StepIcon` - Stepper
- `MobileStepper` - Mobile stepper variant

#### Typography & Links
- `Typography` - Text component
- `Link` - Link component

#### Advanced
- `Portal` - Render outside DOM tree
- `NoSsr` - Client-side only rendering
- `Unstable_TrapFocus` - Focus trap utility
- `ClickAwayListener` - Click outside detection
- `TextareaAutosize` - Auto-sizing textarea

---

### 2.2 Hooks (6 total)

```typescript
// Responsive design
useMediaQuery(query: string | object, options?: object): boolean
  - Matches CSS media query

// Theming
useTheme(): Theme
  - Access current theme object

useThemeProps({ props, name }): Props
  - Apply theme default props to component props

// Component utilities
useMediaQuery(theme.breakpoints.up('sm'))  // Common pattern
useScrollTrigger(options?): boolean        // When to show floating action
usePagination(options?): PaginationApi     // Pagination logic
useAutocomplete(options?): AutocompleteApi // Autocomplete logic
useLazyRipple(options?): RippleApi         // Touch ripple effect
useControlled(options?): [value, setValue] // Controlled/uncontrolled pattern
```

---

### 2.3 Theming System

#### Theme Creation & Management
```typescript
// Core theming
createTheme(options?, ...args): Theme
  - Creates MUI theme object with all values

extendTheme(options?, ...args): Theme
  - Extends base theme (CSS variables variant)

experimental_extendTheme(options?): Theme
  - Modern CSS variables theme

ThemeProvider({ theme, children, ...props }): JSX.Element
  - Context provider for theme

useTheme(): Theme
  - Hook to access current theme
```

#### Theme Composition
```typescript
// Color utilities
createColorScheme(options?): ColorScheme
  - Define light/dark color schemes

enhanceHighContrast(theme): Theme
  - Add high contrast mode support

alpha(color, value): string
  - Apply alpha transparency

darken(color, coefficient): string
lighten(color, coefficient): string

hexToRgb(hex): string
rgbToHex(rgb): string
hslToRgb(hsl): string
decomposeColor(color): ColorObject
recomposeColor(color): string
getContrastRatio(foreground, background): number
getLuminance(color): number
emphasize(color, coefficient): string
```

#### Typography & Spacing
```typescript
createTypography(palette?, options?): Typography
  - Create typography scale

createMixins(breakpoints?): Mixins
  - Create CSS-in-JS mixins

createSpacing(spacing?): Spacing
  - Create spacing scale function
```

#### Transitions & Animations
```typescript
createTransitions(): Transitions
  - Create transition definitions

duration: { shortest, shorter, short, standard, complex, enteringScreen, leavingScreen }
easing: { easeInOut, easeOut, easeIn, linear, sharp, ... }
```

#### Breakpoints
```typescript
unstable_createBreakpoints(options?): Breakpoints
  - Define responsive breakpoints

// Access in theme
theme.breakpoints.up('sm')    // @media (min-width: 600px)
theme.breakpoints.down('sm')  // @media (max-width: 599px)
theme.breakpoints.only('sm')  // Only small screens
theme.breakpoints.between('sm', 'md')
```

#### Legacy Theming (v4 → v5 migration)
```typescript
adaptV4Theme(v4Theme): Theme
  - Convert v4 theme to v5 format

unstable_createMuiStrictModeTheme(options?): Theme
  - Theme for React StrictMode
```

---

### 2.4 Styling System

#### Core Styling
```typescript
// styled-components-like API
styled(Component, options?)(styles): StyledComponent
  - Create styled components

// Sx prop usage
sx?: SxProps<Theme>
  - Inline responsive styling on any component
  - Access to theme values
  - Breakpoint arrays: { xs: value, sm: value, ... }
  - Shorthand CSS: { mb: 2, p: 1, ... }

// Class name generation
generateUtilityClass(componentName, slotName): string
  - Generate BEM class name

generateUtilityClasses(componentName, slots): Record<string, string>
  - Generate all slot class names
```

#### Global Styles
```typescript
GlobalStyles({ styles, noDefaultStyles? }): JSX.Element
  - Apply global CSS

CssBaseline(): JSX.Element
  - Normalize & reset styles

ScopedCssBaseline(): JSX.Element
  - Scoped CssBaseline (doesn't affect whole page)

darkScrollbar(): CSSProperties
  - Dark mode scrollbar styles
```

#### CSS Variables (Modern Theming)
```typescript
// CSS Variables support
InitColorSchemeScript(options?): JSX.Element
  - Script for color scheme detection (SSR safe)

getOverlayAlpha(elevation): number
  - Get opacity for elevation overlays

shouldSkipGeneratingVar(args): boolean
  - Filter which theme values become CSS variables
```

#### Color System
```typescript
colors: {
  red: { 50, 100, 200, ..., 900, A100, A200, A400, A700 },
  pink: { ... },
  purple: { ... },
  deepPurple: { ... },
  indigo: { ... },
  blue: { ... },
  lightBlue: { ... },
  cyan: { ... },
  teal: { ... },
  green: { ... },
  lightGreen: { ... },
  lime: { ... },
  yellow: { ... },
  amber: { ... },
  orange: { ... },
  deepOrange: { ... },
  brown: { ... },
  grey: { 50, 100, ..., 900 },
  blueGrey: { ... },
  common: { black, white },
}
```

---

### 2.5 Customization Hooks

#### Component Props Customization
```typescript
// Override default props globally
<DefaultPropsProvider value={{ Button: { variant: 'outlined' } }}>
  {children}
</DefaultPropsProvider>

useDefaultProps({ props, name }): Props
  - Hook to access default props for component
```

#### Component Class Overrides
```typescript
// In theme.components
theme.components = {
  MuiButton: {
    defaultProps: { variant: 'contained' },
    styleOverrides: {
      root: { /* CSS */ },
      contained: { /* CSS */ },
    },
    variants: [
      {
        props: { variant: 'custom' },
        style: { /* CSS */ },
      },
    ],
  },
}
```

#### Overridable Components Pattern
```typescript
// Most MUI components support:
component?: React.ElementType  // Change root element
  <Button component="a" href="/">Link Button</Button>

classes?: Partial<ComponentClasses>
  - Override internal class names
```

---

### 2.6 Utility Functions

#### Component Creation
```typescript
createSvgIcon(path, displayName?): React.Component
  - Create custom SVG icon component

createChainedFunction(...funcs): Function
  - Chain multiple callbacks

isMuiElement(element, types?): boolean
  - Check if React element is MUI component
```

#### DOM Utilities
```typescript
getActiveElement(doc?): Element | null
  - Get currently focused element

ownerDocument(node): Document
ownerWindow(node): Window
  - Get document/window from node

setRef(ref, value): void
  - Set ref value (handles function & object refs)

useForkRef(refA, refB): Ref
  - Combine multiple refs
```

#### Form/Input Utilities
```typescript
mergeSlotProps(slotPropsArray): SlotProps
  - Merge multiple slot prop objects

capitalize(string): string
  - Capitalize first character

deprecatedPropType(validator, reason): PropValidator
  - Warn about deprecated props

unsupportedProp(props, propName): Error | null
  - Validate prop is not used

requirePropFactory(requireFn): PropValidator
  - Create conditional prop validator
```

#### Styling Utilities
```typescript
debounce(func, wait?, options?): Function
  - Debounce function calls

unstable_composeClasses(slots, getUtilityClass?, clsx?): string
  - Compose class names from slots

useEventCallback(callback): Callback
  - Memoized event callback

unstable_useId(): string
  - Generate unique ID (React 18+)
```

---

## 3. Extension Points

### 3.1 Theme Customization

The theme object is fully customizable:

```typescript
interface Theme {
  // Palette (colors)
  palette: {
    mode: 'light' | 'dark',
    primary: PaletteColor,
    secondary: PaletteColor,
    success: PaletteColor,
    warning: PaletteColor,
    error: PaletteColor,
    info: PaletteColor,
    background: { default, paper, ... },
    text: { primary, secondary, disabled, ... },
    divider: string,
    action: { active, hover, selected, focus, disabled, ... },
    custom: { /* custom colors */ },
  },
  
  // Typography
  typography: {
    fontFamily: string,
    fontSize: number,
    fontWeightLight: number,
    fontWeightRegular: number,
    fontWeightMedium: number,
    fontWeightBold: number,
    h1, h2, h3, h4, h5, h6,
    body1, body2,
    button, caption, overline,
    /* custom variants */
  },
  
  // Spacing
  spacing: (multiplier: number) => string,
  
  // Breakpoints
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1264,
    xl: 1920,
  },
  
  // Shadows
  shadows: [none, ...24 elevation levels],
  
  // Transitions
  transitions: { create, duration, easing },
  
  // Shape (border radius)
  shape: { borderRadius: number },
  
  // Component overrides
  components: {
    [ComponentName]: {
      defaultProps: { /* default props */ },
      styleOverrides: { /* CSS overrides */ },
      variants: [{ props, style }, ...],
    },
  },
  
  // Mixins
  mixins: { toolbar, gutters, ... },
  
  // Custom fields
  custom: { /* any custom values */ },
}
```

### 3.2 Component Slot Customization

Many components support slots pattern:

```typescript
// Component with slots
<Select
  slots={{
    root: CustomRoot,
    popper: CustomPopper,
  }}
  slotProps={{
    root: { className: 'custom' },
    popper: { modifiers: [...] },
  }}
/>
```

### 3.3 Provider Patterns

```typescript
// Theme provider
<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>

// Default props provider
<DefaultPropsProvider value={defaults}>
  <App />
</DefaultPropsProvider>

// Styled engine provider (rarely needed)
<StyledEngineProvider injectFirst>
  <App />
</StyledEngineProvider>
```

### 3.4 Styled Engine Integration

By default, MUI uses Emotion for CSS-in-JS. You can swap with styled-components:

```typescript
// Install: @mui/styled-engine-sc
import { StyledEngineProvider } from '@mui/material/styles';
<StyledEngineProvider injectFirst>
  <App />
</StyledEngineProvider>
```

---

## 4. Integration Patterns

### 4.1 With Next.js

```typescript
// @mui/material-nextjs provides integration
import { AppRouterCacheProvider } from '@mui/material-nextjs/appRouter';

export default function RootLayout({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

### 4.2 With Pigment CSS (Zero-Runtime CSS)

```typescript
// @mui/material-pigment-css - static CSS extraction
import { PigmentContainer, PigmentGrid, PigmentStack } from '@mui/material';

// These components compile to zero-runtime CSS
<PigmentContainer sx={{ maxWidth: 'lg' }}>
  <PigmentStack spacing={2}>
    {/* Content */}
  </PigmentStack>
</PigmentContainer>
```

### 4.3 With Emotion

```typescript
import { css } from '@emotion/react';
import { useTheme } from '@mui/material/styles';

const Component = () => {
  const theme = useTheme();
  const styles = css`
    color: ${theme.palette.primary.main};
    margin: ${theme.spacing(2)};
  `;
  return <div css={styles}>Styled</div>;
};
```

---

## 5. Version Considerations

### 5.1 Breaking Changes (v8 → v9)

- **Pigment CSS**: New zero-runtime CSS solution
- **CSS Variables**: Now default theme option
- **TypeScript 6**: Requires TS 6+
- **React 19**: Now supported, 17+ required
- **Node 22+**: Node 14+ still supported

### 5.2 Deprecations

```typescript
// Deprecated (v6+ removed)
makeStyles()          // Use sx prop or styled instead
withStyles()          // Use styled instead
withTheme()           // Use useTheme hook
jssClasses            // Use CSS modules or sx prop

// Experimental/Unstable
unstable_createBreakpoints
unstable_memoTheme
unstable_useEnhancedEffect
unstable_useId
unstable_ClassNameGenerator
```

---

## 6. Type System

### 6.1 Key Types

```typescript
// Theme type augmentation
declare module '@mui/material/styles' {
  interface Theme {
    custom: { myProperty: string },
  }
  interface ThemeOptions {
    custom: { myProperty?: string },
  }
  interface Palette {
    custom: PaletteColor,
  }
  interface PaletteOptions {
    custom: PaletteColorOptions,
  }
}

// Component props augmentation
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    custom: true,
  }
}
```

### 6.2 Common Type Patterns

```typescript
// SX prop (responsive styling)
sx?: SxProps<Theme>

// Overridable components
component?: React.ElementType
classes?: Partial<ComponentClasses>

// Slots pattern
slots?: Record<string, React.ElementType>
slotProps?: Record<string, any>

// Transitions
transition?: 'all' | 'primary' | string
transitionDuration?: number | string | { enter, exit }
transitionTimingFunction?: string
```

---

## 7. Export Paths

### Main Package Exports
```typescript
// Default imports
import { Button, TextField, Box } from '@mui/material'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

// Sub-package imports (recommended for tree-shaking)
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'

// Specific utilities
import { generateUtilityClass } from '@mui/material/generateUtilityClass'
import colors from '@mui/material/colors'
import transitions from '@mui/material/styles/transitions'
```

### System Package Exports
```typescript
import { Box, Grid, Stack } from '@mui/system'
import { styled } from '@mui/system'
import { useTheme, useMediaQuery } from '@mui/system'
```

---

## 8. Architecture Highlights

### Component Structure
- **Root Element**: Customizable via `component` prop
- **Slot Architecture**: Many components use slots for internal elements
- **Classes**: BEM-style generated class names (overridable)
- **Style Overrides**: Via theme or `sx` prop
- **Default Props**: Via `DefaultPropsProvider` or theme

### Theming Strategy
- **CSS Variables**: Modern approach (enabled by default in v9)
- **System Tokens**: Color, spacing, typography all theme-aware
- **Dark Mode**: Built-in via `mode` in theme or `colorScheme` context
- **Responsive**: Breakpoints, `useMediaQuery`, responsive sx arrays

### Performance Optimizations
- Tree-shakeable: Import only what you use
- No runtime CSS generation (Pigment CSS option)
- Memoization: `unstable_memoTheme` for performance
- CSS Variables: Reduces JS bundle size (zero-runtime)

---

## 9. Common Integration Checklist

- [ ] Install `@mui/material @emotion/react @emotion/styled @mui/icons-material`
- [ ] Wrap app with `ThemeProvider`
- [ ] Add `CssBaseline` for normalize CSS
- [ ] Configure custom theme (palette, typography, breakpoints)
- [ ] Set up dark mode via `InitColorSchemeScript` (SSR safe)
- [ ] Define component overrides in theme
- [ ] Use `sx` prop for responsive styling
- [ ] Leverage `useTheme` and `useMediaQuery` hooks
- [ ] Consider Pigment CSS for zero-runtime CSS
- [ ] Type augmentation for custom theme properties

---

## 10. Key Resources

- **Documentation**: https://mui.com
- **Component API**: https://mui.com/material-ui/api/
- **Theming Guide**: https://mui.com/material-ui/customization/theming/
- **System Documentation**: https://mui.com/system/getting-started/
- **Icons Gallery**: https://mui.com/material-icons/
- **Examples**: https://github.com/mui/material-ui/tree/master/docs

---

🤖 **Codex Oracle** — API Surface Documentation  
Analyzed: Material-UI v9.1.2 | Source: `/home/user/ghq/github.com/mui/material-ui`
