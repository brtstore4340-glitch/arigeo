# Material-UI (MUI) Quick Reference Guide

**Version:** v5.x / v6.x  
**Created:** 2026-06-28  
**Purpose:** Comprehensive quick reference for implementing Material Design in React applications

---

## Table of Contents

1. [What is Material-UI?](#what-is-material-ui)
2. [Installation Methods](#installation-methods)
3. [Core Packages Overview](#core-packages-overview)
4. [Key Features with Examples](#key-features-with-examples)
5. [Configuration & Customization](#configuration--customization)
6. [Common Usage Patterns](#common-usage-patterns)
7. [Directory of Main Packages](#directory-of-main-packages)
8. [Theming Deep Dive](#theming-deep-dive)
9. [Advanced Patterns](#advanced-patterns)
10. [Common Gotchas & Solutions](#common-gotchas--solutions)

---

## What is Material-UI?

### The Problem It Solves

Material-UI (MUI) is a **React component library implementing Google's Material Design** specification. It solves:

- **Design Consistency**: Pre-built components that follow Material Design principles
- **Rapid Prototyping**: No need to build form inputs, buttons, modals, data tables from scratch
- **Styling at Scale**: CSS-in-JS approach (Emotion/styled-components) that avoids class naming conflicts
- **Accessibility**: Components built with WCAG 2.1 AA compliance
- **Customization**: Comprehensive theming system allows brand customization without component rewrites
- **Production Ready**: Used by Google, Stripe, Airbnb, Shopify and thousands of enterprises

### Key Philosophies

- **Opinionated but Flexible**: Follows Material Design by default, but highly themeable
- **API Stability**: Semantic versioning ensures predictable upgrades
- **Component Composition**: Compound component patterns enable flexibility
- **Performance**: Tree-shaking friendly, modular imports prevent bundle bloat

### Material Design Principles

- **Material is the metaphor**: Physical surfaces with depth and shadows
- **Bold, graphic, intentional**: Clear typography and color hierarchies
- **Motion provides meaning**: Animations guide user attention
- **Responsive**: Works from mobile to desktop seamlessly

---

## Installation Methods

### 1. Basic Installation with npm/yarn

```bash
# npm
npm install @mui/material @emotion/react @emotion/styled

# yarn
yarn add @mui/material @emotion/react @emotion/styled

# pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

**Why both packages?**
- `@mui/material`: The component library
- `@emotion/react`, `@emotion/styled`: CSS-in-JS engine (required peer dependency)

### 2. With Icons Package (Recommended)

```bash
npm install @mui/icons-material
```

Adds 2000+ Material Design Icons. Install specific icons or full library.

### 3. With Other Official Packages

```bash
# Lab components (experimental/preview features)
npm install @mui/lab

# X components (data grid, charts, date picker)
npm install @mui/x-data-grid @mui/x-charts @mui/x-date-pickers

# Styled variants (pre-built theme integrations)
npm install @mui/material-nextjs
```

### 4. Alternative Styling Engine (styled-components)

```bash
npm install @mui/material styled-components
# Configure in MUI: import { CssVarsProvider } from '@mui/material'
```

### 5. Setup Verification

Create a simple component to verify installation:

```jsx
import { Button } from '@mui/material';

function App() {
  return <Button variant="contained">Click me</Button>;
}

export default App;
```

If the button renders with Material Design styling, installation successful ✓

---

## Core Packages Overview

### @mui/material

**The main component library**

```
Contains:
├── Components (80+)
│   ├── Surfaces: Paper, Card, AppBar, Drawer
│   ├── Navigation: Tabs, Breadcrumbs, Pagination
│   ├── Inputs: TextField, Select, Checkbox, Radio, Switch
│   ├── Data Display: Table, List, Typography, Chip, Avatar
│   ├── Feedback: Dialog, Snackbar, Alert, Progress
│   ├── Surfaces: Container, Grid, Box, Stack
│   └── Lab: Experimental components (TreeView, Timeline, etc.)
├── Hooks
│   ├── useTheme()
│   ├── useMediaQuery()
│   ├── useLocalStorage()
│   └── Responsive utilities
├── System (sx prop, styling utilities)
├── Utils (createTheme, createPalette, etc.)
└── Icons (3+ versions per icon: outlined, filled, rounded)
```

### @mui/icons-material

**2000+ Material Design Icons**

```javascript
// Usage
import { Home, Settings, Search } from '@mui/icons-material';

// Variants available: Outlined, Filled, Rounded, Sharp, TwoTone
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
```

### @mui/lab

**Pre-release and experimental components**

```
├── TreeView, Timeline (hierarchical UI)
├── ImageList, ImageListItem (gallery layouts)
├── Rating (star rating)
├── Skeleton (loading placeholders)
├── SpeedDial (floating action button menu)
└── Masonry (Pinterest-style layouts)
```

### @mui/x-data-grid

**Enterprise-grade data table**

```javascript
import { DataGrid } from '@mui/x-data-grid';

// Features:
// - 100k+ row virtualization
// - Column resizing, reordering, pinning
// - Row selection, grouping
// - Filtering, sorting, pagination
// - Built-in Excel export
```

### @mui/x-charts

**Chart components (bar, line, pie, scatter, etc.)**

```javascript
import { BarChart, LineChart } from '@mui/x-charts';

// Features:
// - Responsive, accessible charts
// - Server-side aggregation support
// - Interactive tooltips and legends
```

### @mui/x-date-pickers

**Date and time selection components**

```javascript
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';

// Adapters required: date-fns, dayjs, luxon, moment
```

---

## Key Features with Examples

### 1. Component-Based Architecture

MUI provides 80+ pre-built components organized by purpose:

```jsx
import {
  AppBar, Toolbar, Button, TextField, Container,
  Grid, Card, CardContent, Typography
} from '@mui/material';

export function DashboardLayout() {
  return (
    <>
      {/* Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">
                  Statistics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
```

### 2. The `sx` Prop (Styling System)

MUI's superpower for inline styling with theme access:

```jsx
<Box
  sx={{
    // Standard CSS
    width: '100%',
    padding: 2,
    
    // Responsive values (mobile-first)
    fontSize: { xs: '12px', sm: '14px', md: '16px' },
    
    // Theme tokens (colors, spacing, breakpoints)
    backgroundColor: 'primary.main',
    color: 'text.primary',
    
    // Pseudo-selectors
    '&:hover': {
      backgroundColor: 'primary.light',
      boxShadow: 3,
    },
    
    // Nested selectors
    '& .nested-class': {
      color: 'secondary.main',
    },
    
    // Media queries
    '@media (max-width: 600px)': {
      padding: 1,
    },
  }}
>
  Powerful Styling
</Box>
```

### 3. Responsive Grid System

Mobile-first, 12-column grid layout:

```jsx
<Grid container spacing={2}>
  {/* Responsive columns: full width on xs, half on sm, 1/3 on md */}
  <Grid item xs={12} sm={6} md={4}>
    Column 1
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    Column 2
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    Column 3
  </Grid>
</Grid>
```

### 4. Form Components with Validation

```jsx
import { TextField, Button, Stack, FormHelperText } from '@mui/material';
import { useState } from 'react';

export function ContactForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    // Submit...
  };

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
        fullWidth
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Stack>
  );
}
```

### 5. Dialogs & Modals

```jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to proceed?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

### 6. Data Table (DataGrid)

```jsx
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First Name', width: 150 },
  { field: 'lastName', headerName: 'Last Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
];

const rows = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
];

export function UsersTable() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[5, 10, 25, 50]}
      checkboxSelection
      disableSelectionOnClick
      sx={{ height: 400 }}
    />
  );
}
```

### 7. Theme Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
        },
      },
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

---

## Configuration & Customization

### 1. Theme Configuration (Full Reference)

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // 1. Breakpoints (for responsive design)
  breakpoints: {
    values: {
      xs: 0,      // Mobile
      sm: 600,    // Tablet
      md: 960,    // Laptop
      lg: 1280,   // Desktop
      xl: 1920,   // Large screen
    },
  },

  // 2. Palette (colors for your app)
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
    },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
    success: { main: '#4caf50' },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.60)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },

  // 3. Typography
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: '6rem', fontWeight: 300 },
    h2: { fontSize: '3.75rem', fontWeight: 300 },
    h3: { fontSize: '3rem', fontWeight: 400 },
    h4: { fontSize: '2.125rem', fontWeight: 400 },
    h5: { fontSize: '1.5rem', fontWeight: 400 },
    h6: { fontSize: '1.25rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase' },
    caption: { fontSize: '0.75rem', fontWeight: 400 },
    overline: { fontSize: '0.75rem', fontWeight: 500 },
  },

  // 4. Spacing (multiply by 8px by default)
  spacing: 8, // 1 unit = 8px, so spacing(2) = 16px

  // 5. Shape (border radius)
  shape: {
    borderRadius: 4,
  },

  // 6. Component overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
  },

  // 7. Shadows (for depth)
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2)',
    // ... more shadows
  ],
});
```

### 2. Dark Mode Implementation

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';

export function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode
      </Button>
      {/* App content */}
    </ThemeProvider>
  );
}
```

### 3. CSS Variables (v6+)

```jsx
import { CssVarsProvider } from '@mui/material/styles';

export function App() {
  return (
    <CssVarsProvider>
      {/* Components can now use CSS variables */}
    </CssVarsProvider>
  );
}
```

### 4. Global Styles

```jsx
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
  // Your theme config
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets browser defaults */}
      {/* Your app */}
    </ThemeProvider>
  );
}
```

---

## Common Usage Patterns

### Pattern 1: Responsive Container Layout

```jsx
import { Container, Box, Grid, Paper } from '@mui/material';

export function ResponsiveLayout() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            Main content area (full width on mobile, 2/3 on desktop)
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            Sidebar (full width on mobile, 1/3 on desktop)
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
```

### Pattern 2: Compound Form

```jsx
import {
  Box, TextField, Select, MenuItem, Button, 
  FormControl, InputLabel, Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export function CompoundForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      role: '',
      email: '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500 }}>
      <Stack spacing={2}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Name" fullWidth />
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select {...field} label="Role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Stack>
    </Box>
  );
}
```

### Pattern 3: Data Table with Search & Filter

```jsx
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box } from '@mui/material';
import { useState, useMemo } from 'react';

export function SearchableTable({ data, columns }) {
  const [searchText, setSearchText] = useState('');

  const filteredRows = useMemo(() => {
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText]);

  return (
    <Box>
      <TextField
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        sx={{ height: 600 }}
      />
    </Box>
  );
}
```

### Pattern 4: Modal with Form

```jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useState } from 'react';

export function EditDialog({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Record</DialogTitle>
      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Pattern 5: Responsive Navigation Menu

```jsx
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

export function ResponsiveNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  if (isMobile) {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Home</MenuItem>
            <MenuItem>About</MenuItem>
            <MenuItem>Contact</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

---

## Directory of Main Packages

### @mui/material

| Category | Components |
|----------|-----------|
| **App Bar & Navigation** | AppBar, Toolbar, Tabs, Breadcrumbs, Pagination, Stepper, Menu |
| **Surfaces** | Paper, Card, Accordion, Dialog, Drawer, Popover |
| **Inputs** | TextField, Select, Checkbox, Radio, Switch, Slider, Rating |
| **Feedback** | Alert, Progress, CircularProgress, Skeleton, Snackbar, Badge |
| **Data Display** | Table, List, Typography, Chip, Avatar, Tooltip, Timeline |
| **Layout** | Container, Grid, Stack, Box, CssBaseline, Divider |
| **Media** | ImageList, ImageListItem |
| **Utility** | Portal, NoSsr, ClickAwayListener, Backdrop, Modal |

### @mui/icons-material

```javascript
// 2000+ icons in 5 variants each:
Variant Options:
- Filled (default): filled
- Outlined: _Outlined
- Rounded: _Rounded
- Sharp: _Sharp
- TwoTone: _TwoTone

Examples:
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
```

### @mui/x-data-grid

```javascript
DataGrid Features:
✓ Row virtualization (100k+ rows)
✓ Column resizing, reordering, pinning
✓ Row selection (single/multi)
✓ Sorting, filtering, searching
✓ Pagination with custom page sizes
✓ Cell rendering customization
✓ Row actions (edit, delete, etc.)
✓ Excel export
✓ Aggregation functions
✓ Row grouping & pinning
```

### @mui/lab

Experimental components for testing:
- TreeView / TreeItem
- Timeline / TimelineItem
- ImageList / ImageListItem
- Rating
- Skeleton
- Masonry
- SpeedDial
- Toggle Button / Button Group

### @mui/x-charts

Chart types:
- BarChart (horizontal & vertical)
- LineChart (line & area)
- PieChart / DoughnutChart
- ScatterChart
- Heatmap

---

## Theming Deep Dive

### How MUI Theming Works

```
1. createTheme() → JavaScript object with all design tokens
   ↓
2. ThemeProvider → Wraps your app and provides via React Context
   ↓
3. useTheme() hook → Access theme in any component
   ↓
4. sx prop / styled() → Components consume theme tokens
```

### Accessing Theme in Custom Components

```jsx
import { useTheme, Box } from '@mui/material';

export function CustomComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        color: theme.palette.primary.main,
        padding: theme.spacing(2), // 16px (2 * 8px)
        breakpoint: theme.breakpoints.down('md'),
      }}
    >
      Uses theme values
    </Box>
  );
}
```

### CSS-in-JS with Emotion

All MUI components use Emotion under the hood:

```jsx
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Create custom component with theme access
const CustomButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '1.25rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

// Use it like normal
<CustomButton variant="contained">Custom Button</CustomButton>
```

### Advanced: Multiple Themes

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';

const lightTheme = createTheme({
  palette: { mode: 'light' }
});

const darkTheme = createTheme({
  palette: { mode: 'dark' }
});

const brandTheme = createTheme({
  palette: {
    primary: { main: '#ff6b6b' },
    secondary: { main: '#4ecdc4' }
  }
});

export function App() {
  const [theme, setTheme] = useState('light');

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    brand: brandTheme
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <ThemeSwitcher onThemeChange={setTheme} />
    </ThemeProvider>
  );
}
```

---

## Advanced Patterns

### 1. Custom Hooks for Theme Responsive Values

```jsx
import { useTheme, useMediaQuery } from '@mui/material';

export function useResponsiveValue(mobileValue, desktopValue) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile ? mobileValue : desktopValue;
}

// Usage
function MyComponent() {
  const padding = useResponsiveValue(8, 16);
  return <Box sx={{ p: padding }}>Responsive padding</Box>;
}
```

### 2. Compound Components with Context

```jsx
import { createContext, useContext } from 'react';
import { Card, CardContent, CardActions, Button } from '@mui/material';

const CardContext = createContext();

function CustomCard({ children, elevation = 2 }) {
  return (
    <CardContext.Provider value={{ elevation }}>
      <Card elevation={elevation}>
        {children}
      </Card>
    </CardContext.Provider>
  );
}

function CardHeader({ children }) {
  const { elevation } = useContext(CardContext);
  return <CardContent sx={{ borderBottom: '1px solid #eee' }}>{children}</CardContent>;
}

function CardBody({ children }) {
  return <CardContent>{children}</CardContent>;
}

function CardFooter({ children }) {
  return <CardActions>{children}</CardActions>;
}

// Usage
<CustomCard>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter><Button>Action</Button></CardFooter>
</CustomCard>
```

### 3. Data Grid with Server-Side Operations

```jsx
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';

export function ServerSideGrid() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  useEffect(() => {
    setLoading(true);
    
    // Call API with pagination, sort, filter params
    fetch(`/api/data?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`)
      .then(r => r.json())
      .then(data => {
        setRows(data.rows);
        setLoading(false);
      });
  }, [paginationModel, sortModel, filterModel]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      filterModel={filterModel}
      onFilterModelChange={setFilterModel}
      rowCount={totalRows} // Total rows from server
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
    />
  );
}
```

### 4. Custom Form Components

```jsx
import { TextField as MuiTextField, FormHelperText, FormControl } from '@mui/material';
import { forwardRef } from 'react';

const TextField = forwardRef(({
  label,
  error,
  helperText,
  required,
  ...props
}, ref) => (
  <FormControl fullWidth error={!!error}>
    <MuiTextField
      ref={ref}
      label={required ? `${label} *` : label}
      error={!!error}
      {...props}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
));

export default TextField;
```

---

## Common Gotchas & Solutions

### Gotcha 1: Box vs Container

```jsx
// Container: Fixed width + centered, with responsive max-widths
<Container maxWidth="lg">Fixed-width centered layout</Container>

// Box: Flexible wrapper with sx prop support
<Box>Flexible layout</Box>

// Use Container for page layouts, Box for component styling
```

### Gotcha 2: Spacing Values

```jsx
// spacing(n) multiplies by 8px by default
<Box sx={{ p: 1 }}>8px padding</Box>
<Box sx={{ p: 2 }}>16px padding</Box>

// Mix units in sx prop
<Box sx={{ p: '16px', m: 2 }}>Mixed units</Box>
```

### Gotcha 3: ResponsiveValue Order (Mobile-First)

```jsx
// ✅ CORRECT: Mobile first, then larger screens
<Box sx={{ 
  fontSize: { xs: '12px', sm: '14px', md: '16px' } 
}}>Mobile-first is best</Box>

// ❌ WRONG: Don't reverse the order
<Box sx={{ 
  fontSize: { md: '16px', sm: '14px', xs: '12px' } 
}}>This is harder to read</Box>
```

### Gotcha 4: Typography Variants

```jsx
// Use Typography component for text, don't use raw tags
✅ <Typography variant="h1">Heading</Typography>
❌ <h1>Heading</h1>

// Typography respects theme typography settings
```

### Gotcha 5: Keyboard Navigation & Accessibility

```jsx
// Always provide accessible labels
<TextField
  label="Search"  // Label for screen readers
  aria-label="Search products"
  placeholder="Enter product name"
/>

// Use semantic HTML in data
<List>
  {items.map(item => (
    <ListItem key={item.id}>
      <ListItemButton onClick={() => selectItem(item)}>
        {item.name}
      </ListItemButton>
    </ListItem>
  ))}
</List>
```

### Gotcha 6: DataGrid License (Pro vs Free)

```javascript
// Free version (MIT):
// ✓ Basic grid, sorting, filtering, pagination
// ✓ Row selection, column reordering
// ✗ No row grouping, pinning, tree data

// Pro version (requires license):
// ✓ All free features plus:
// ✓ Row grouping, pinning, tree data
// ✓ Master-detail rows
// ✓ Row spanning
// ✓ Advanced filtering

import { DataGrid } from '@mui/x-data-grid'; // Free
// vs
import { DataGridPro } from '@mui/x-data-grid-pro'; // Paid
```

### Gotcha 7: Dialog Scroll Behavior

```jsx
// ScrollDialog defaults to 'paper', which scrolls content inside dialog
<Dialog open={open} onClose={onClose} scroll="paper">
  <DialogTitle>Long content</DialogTitle>
  <DialogContent>Scrolls inside dialog</DialogContent>
</Dialog>

// Change to 'body' to scroll entire page behind dialog
<Dialog open={open} onClose={onClose} scroll="body">
  {/* Body scrolls behind dialog */}
</Dialog>
```

### Gotcha 8: Icon Size & Color

```jsx
// Icons inherit color from parent or explicit color prop
<HomeIcon color="primary" fontSize="large" />
<SettingsIcon sx={{ color: 'error.main', fontSize: 32 }} />

// Default is 24px (1.5rem), use fontSize prop:
// 'small' → 20px
// 'medium' → 24px (default)
// 'large' → 35px
// Or custom: fontSize={48}
```

---

## Performance Tips

1. **Use Dynamic Imports for Code Splitting**
```javascript
const DataGridComponent = dynamic(() => import('@mui/x-data-grid'), {
  ssr: false,
});
```

2. **Memoize Theme Object**
```javascript
const theme = useMemo(() => createTheme({...}), []);
```

3. **Use sx prop over styled** (for one-off styles)
```javascript
// ✅ Simple, performant for one-off
<Box sx={{ color: 'red' }}>Text</Box>

// ✅ Better for reused, complex styles
const StyledBox = styled(Box)(({ theme }) => ({...}));
```

4. **Lazy Load Heavy Components**
```javascript
const Dialog = React.lazy(() => import('@mui/material/Dialog'));
```

---

## Resources & Links

- **Official Docs**: https://mui.com/
- **Component API Docs**: https://mui.com/material-ui/api/
- **Icons Browser**: https://mui.com/material-ui/icons/
- **Theme Builder**: https://zenoo.github.io/mui-theme-creator/
- **DataGrid Docs**: https://mui.com/x/react-data-grid/
- **X Charts**: https://mui.com/x/react-charts/
- **Community**: Stack Overflow, GitHub Discussions, Discord

---

## Quick Checklist for New Projects

- [ ] Install `@mui/material @emotion/react @emotion/styled`
- [ ] Install `@mui/icons-material` (optional but recommended)
- [ ] Create theme with `createTheme()`
- [ ] Wrap app with `<ThemeProvider theme={theme}>`
- [ ] Add `<CssBaseline />` for consistent defaults
- [ ] Set up `useMediaQuery` for responsive behavior
- [ ] Define color tokens (primary, secondary, etc.)
- [ ] Configure typography scales
- [ ] Set breakpoints if using non-standard sizes
- [ ] Test dark mode support
- [ ] Audit component overrides for consistency

---

**Document Generated**: 2026-06-28  
**Updated**: For MUI v5.x and v6.x  
🤖 Codex Oracle
