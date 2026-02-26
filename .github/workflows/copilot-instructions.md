# Material UI Development Protocol

This document defines the strict development protocol for all Material UI feature implementations in this project.

All UI work must comply with these rules without exception.

## Official Documentation Sources

All implementations must rely on official MUI documentation.

Primary documentation sources:

- Main Docs: <https://mui.com/material-ui/>
- LLM Reference Index (mandatory source): <https://mui.com/material-ui/llms.txt>

The `llms.txt` file provides structured documentation references for AI and tooling.
This must be considered a primary index when resolving APIs and composition patterns.

Never rely on memory alone.

## Mandatory MCP Workflow

For any MUI-related implementation, this sequence must be followed strictly.

### 1. Call `useMuiDocs`

Fetch relevant documentation based on the feature request.

This must:

- Identify exact component pages
- Confirm correct package origin
- Verify version compatibility

### 2. Call `fetchDocs`

If `useMuiDocs` references additional documentation URLs:

- Fetch those URLs
- Extract API tables
- Extract composition examples
- Extract accessibility notes

Only fetch URLs returned by MCP.

### 3. Repeat Until Complete

Repeat steps 1-2 until all of the following are confirmed:

- Full component API surface
- Required props
- Default behavior
- Controlled vs uncontrolled usage
- Accessibility notes
- Composition patterns
- Import paths
- Package requirements

No assumptions allowed.

### 4. Implement Based on Documentation

Implementation begins only after documentation validation is complete.

Code must reflect official documentation patterns exactly.

## Installation Rules

Material UI installs by package, not per component.

Never install blindly.

### Core Installation (If Not Present)

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Icons (Only If Explicitly Allowed)

Prefer local assets in:

- `/public/icons`
- `/public/images`

Only install if explicitly required:

```bash
npm install @mui/icons-material
```

Never default to MUI Icons automatically.

### MUI X Components

Examples:

- `DataGrid`
- Date Pickers
- Charts
- TreeView

Install only when required and verified via MCP:

```bash
npm install @mui/x-data-grid
npm install @mui/x-date-pickers
```

Always verify:

- Package version
- Licensing requirements (Community vs Pro)
- Peer dependencies

## Styling Rules

All styling must follow MUI System standards.

### Preferred Styling Methods

- `sx` prop (primary method)
- `styled()` utility
- Theme tokens:
  - `theme.spacing`
  - `palette`
  - `typography`
  - `breakpoints`
  - `shape`
  - `transitions`
  - `zIndex`

### Avoid

- Inline hardcoded styles
- Arbitrary pixel values without theme reference
- Overriding internal classes without documentation
- Mixing Tailwind deeply inside MUI internals
- Using `!important`
- Targeting unstable class selectors

## Asset Management

Icons and images must come from:

- `/public/icons`
- `/public/images`

### Avoid

- Raw inline SVG
- Third-party icon libraries
- CDN-hosted images
- Unverified external assets

Unless explicitly instructed.

## Standard Workflow for Building UI Features

### 1. Deconstruct the Request

Break down:

- Layout structure
- Required components
- User interactions
- Loading states
- Empty states
- Error states
- Responsive behavior
- Data dependencies
- Accessibility needs
- Edge cases

### 2. Identify MUI Components

Map requirements to official components.

#### Layout

- `Container`
- `Box`
- `Stack`
- `Grid`

#### Surfaces

- `Paper`
- `Card`
- `Divider`
- `Accordion`

#### Inputs

- `TextField`
- `Select`
- `Checkbox`
- `RadioGroup`
- `Switch`
- `Autocomplete`
- `Slider`

#### Feedback

- `Snackbar`
- `Alert`
- `CircularProgress`
- `LinearProgress`
- `Skeleton`

#### Overlays

- `Dialog`
- `Drawer`
- `Menu`
- `Popover`
- `Tooltip`

#### Data Display

- `Table`
- `List`
- `Chip`
- `Avatar`
- `Badge`
- `DataGrid` (MUI X)

### 3. Fetch Documentation (Mandatory)

Before writing code:

- Call `useMuiDocs`
- Call `fetchDocs` if needed

Confirm:

- Props
- Slots
- Event handling
- Accessibility behavior
- Controlled vs uncontrolled usage
- Composition model
- Theming patterns
- Migration notes (if applicable)

### 4. Install Required Packages

Only install after confirming documentation requirements.

Never import from:

- `@mui/x-*`
- `@mui/icons-material`

Without installation confirmation.

### 5. Generate Code

Code must:

- Use documented APIs only
- Follow theme tokens
- Use `sx`
- Be responsive
- Be accessible
- Use semantic layout
- Avoid deprecated APIs
- Follow proper component composition

### 6. Quality Pass Checklist

Before finalizing:

- Responsive layout verified
- Loading state implemented
- Empty state implemented
- Error state handled
- Keyboard accessibility verified
- `aria` attributes preserved
- No deprecated APIs
- Clean hierarchy
- Spacing consistency (theme-based)
- No console warnings

## Theming Rules

When modifying or extending theme:

Use:

- `createTheme()`
- `ThemeProvider`

Extend safely:

- `palette`
- `typography`
- `components`
- `spacing`
- `shape`
- `breakpoints`

### Reusable Design Patterns

For repeated design patterns:

- Create themed reusable components
- Use `components` overrides in theme
- Avoid one-off style duplication

## Responsive Design Rules

Use:

- `theme.breakpoints`
- `useMediaQuery`
- Responsive `sx` object syntax

Example:

```tsx
sx={{
  px: { xs: 2, md: 4 },
  display: { xs: 'block', md: 'flex' }
}}
```

Avoid hardcoded media queries unless absolutely necessary.

## What Must Never Be Done

- Skip MCP documentation lookup
- Assume API behavior
- Use deprecated `GridLegacy`
- Use undocumented internal classes
- Mix styling paradigms inconsistently
- Install unnecessary packages
- Use unstable experimental APIs without verification
- Ignore accessibility defaults

## Version Awareness

Before implementation:

- Confirm installed MUI version
- Check migration guides if upgrading
- Avoid deprecated props
- Verify breaking changes
- Confirm compatibility with MUI X packages

## Enforcement Principle

If documentation is unclear:

- Re-run MCP lookup
- Re-check `llms.txt`
- Verify related component pages
- Confirm composition patterns

Implementation must never precede documentation validation.
