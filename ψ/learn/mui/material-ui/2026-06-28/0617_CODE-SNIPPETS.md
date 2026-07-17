---
name: 0617-code-snippets
description: ---
metadata:
  type: handoff
  ttl: ∞
  date: 2026-06-28
  source: fleet-memory
---

# Material-UI Code Snippets & Patterns
**Date**: 2026-06-28 | **Version**: Collected from master branch  
**Source**: https://github.com/mui/material-ui

---

## 1. Main Entry Point: Package Exports

**File**: `packages/mui-material/src/index.js`

The main entry point uses a consistent export pattern for 80+ components:

```javascript
/* eslint-disable import/export */
import * as colors from './colors';

export { colors };
export * from './styles';

// TODO remove, import directly from Base UI or create one folder per module
export * from './utils';

export { default as Accordion } from './Accordion';
export * from './Accordion';

export { default as AccordionActions } from './AccordionActions';
export * from './AccordionActions';

// ... repeats for ~80 components ...

export { default as Button } from './Button';
export * from './Button';

export { default as TextField } from './TextField';
export * from './TextField';

export { default as useMediaQuery } from './useMediaQuery';
export * from './useMediaQuery';

// Utility exports
export { default as unstable_composeClasses } from '@mui/utils/composeClasses';
export { default as generateUtilityClass } from './generateUtilityClass';
export { default as generateUtilityClasses } from './generateUtilityClasses';

export * from './version';
export { default as InitColorSchemeScript } from './InitColorSchemeScript';
```

**Key Pattern**: Each component exports both the default (component) and named exports (types, constants). This maintains consistency across the library and allows tree-shaking.

---

## 2. Core Component Architecture: Button Component

**File**: `packages/mui-material/src/Button/Button.js`

### 2.1 Utility Classes Hook Pattern

Material-UI uses a `useUtilityClasses` hook to dynamically compose CSS classes based on component state:

```javascript
const useUtilityClasses = (ownerState) => {
  const { color, disableElevation, fullWidth, size, variant, loading, loadingPosition, classes } =
    ownerState;

  const slots = {
    root: [
      'root',
      loading && 'loading',
      variant,
      `size${capitalize(size)}`,
      `color${capitalize(color)}`,
      disableElevation && 'disableElevation',
      fullWidth && 'fullWidth',
      loading && `loadingPosition${capitalize(loadingPosition)}`,
    ],
    startIcon: ['icon', 'startIcon'],
    endIcon: ['icon', 'endIcon'],
    loadingIndicator: ['loadingIndicator'],
    loadingWrapper: ['loadingWrapper'],
  };

  const composedClasses = composeClasses(slots, getButtonUtilityClass, classes);

  return {
    ...classes, // forward the focused, disabled, etc. classes to the ButtonBase
    ...composedClasses,
  };
};
```

**Pattern**: 
- `ownerState` is the source of truth for component state
- Classes are computed as conditional arrays, then merged with utility class generation
- Original `classes` are spread to preserve inherited state classes

### 2.2 Styled Component with overridesResolver

```javascript
const ButtonRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === 'classes',
  name: 'MuiButton',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [
      styles.root,
      styles[ownerState.variant],
      styles[`size${capitalize(ownerState.size)}`],
      ownerState.color === 'inherit' && styles.colorInherit,
      ownerState.disableElevation && styles.disableElevation,
      ownerState.fullWidth && styles.fullWidth,
      ownerState.loading && styles.loading,
    ];
  },
})(
  memoTheme(({ theme }) => {
    return {
      ...theme.typography.button,
      minWidth: 64,
      padding: '6px 16px',
      border: 0,
      borderRadius: (theme.vars || theme).shape.borderRadius,
      ...getTransitionStyles(theme, ['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        textDecoration: 'none',
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: `var(--variant-containedColor)`,
            backgroundColor: `var(--variant-containedBg)`,
            boxShadow: (theme.vars || theme).shadows[2],
            '&:hover': {
              boxShadow: (theme.vars || theme).shadows[4],
              '@media (hover: none)': {
                boxShadow: (theme.vars || theme).shadows[2],
              },
            },
          },
        },
        // ... more variants
      ],
    };
  }),
);
```

**Key Patterns**:
- `overridesResolver` enables theme-based style overrides through `theme.components.MuiButton.styleOverrides`
- `memoTheme` wraps theme dependency to prevent unnecessary re-renders
- CSS Variables fallback: `(theme.vars || theme)` supports both CSS variables and static theme
- `variants` array allows conditional styling based on multiple prop combinations

### 2.3 Component Implementation with Composition

```javascript
const Button = React.forwardRef(function Button(inProps, ref) {
  // Props priority: inProps > contextProps > themeDefaultProps
  const contextProps = React.useContext(ButtonGroupContext);
  const buttonGroupButtonContextPositionClassName = React.useContext(ButtonGroupButtonContext);
  const resolvedProps = resolveProps(contextProps, inProps);
  const props = useDefaultProps({ props: resolvedProps, name: 'MuiButton' });
  
  const {
    children,
    color = 'primary',
    component = 'button',
    className,
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    id: idProp,
    loading = null,
    loadingIndicator: loadingIndicatorProp,
    loadingPosition = 'center',
    size = 'medium',
    startIcon: startIconProp,
    type,
    variant = 'text',
    ...other
  } = props;

  const loadingId = useId(idProp);
  const loadingIndicator = loadingIndicatorProp ?? (
    <CircularProgress aria-labelledby={loadingId} color="inherit" size={16} />
  );

  const ownerState = {
    ...props,
    color,
    component,
    disabled,
    disableElevation,
    disableFocusRipple,
    fullWidth,
    loading,
    loadingIndicator,
    loadingPosition,
    size,
    type,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  // Render loading state
  const loader =
    typeof loading === 'boolean' ? (
      <span className={classes.loadingWrapper} style={{ display: 'contents' }}>
        {loading && (
          <ButtonLoadingIndicator className={classes.loadingIndicator} ownerState={ownerState}>
            {loadingIndicator}
          </ButtonLoadingIndicator>
        )}
      </span>
    ) : null;

  // Don't forward the 'root' classes to ButtonBase (prevents duplication)
  const { root, ...forwardedClasses } = classes;

  return (
    <ButtonRoot
      ownerState={ownerState}
      className={clsx(contextProps.className, classes.root, className, positionClassName)}
      component={component}
      disabled={disabled || loading}
      focusRipple={!disableFocusRipple}
      focusVisibleClassName={clsx(classes.focusVisible, focusVisibleClassName)}
      ref={ref}
      internalNativeButton
      type={type}
      id={loading ? loadingId : idProp}
      {...other}
      classes={forwardedClasses}
    >
      {startIcon}
      {loadingPosition !== 'end' && loader}
      {children}
      {loadingPosition === 'end' && loader}
      {endIcon}
    </ButtonRoot>
  );
});
```

**Key Patterns**:
- Context-aware props merging with `useDefaultProps`
- `ownerState` encapsulates all state needed for styling
- Conditional class filtering (`{ root, ...forwardedClasses }`) prevents duplication
- Composition of internal components (loading indicator, icons)

---

## 3. Utility Class Generation System

**File**: `packages/mui-material/src/Button/buttonClasses.ts`

```typescript
export interface ButtonClasses {
  root: string;
  text: string;
  outlined: string;
  contained: string;
  disableElevation: string;
  focusVisible: string;
  disabled: string;
  colorInherit: string;
  // ... 30+ more class definitions
}

export type ButtonClassKey = keyof ButtonClasses;

export function getButtonUtilityClass(slot: string): string {
  return generateUtilityClass('MuiButton', slot);
}

const buttonClasses: ButtonClasses = generateUtilityClasses('MuiButton', [
  'root',
  'text',
  'outlined',
  'contained',
  'disableElevation',
  'focusVisible',
  'disabled',
  'colorInherit',
  'colorPrimary',
  'colorSecondary',
  'colorSuccess',
  'colorError',
  'colorInfo',
  'colorWarning',
  'sizeMedium',
  'sizeSmall',
  'sizeLarge',
  'fullWidth',
  'startIcon',
  'endIcon',
  'icon',
  'loading',
  'loadingWrapper',
  'loadingIconPlaceholder',
  'loadingIndicator',
  'loadingPositionCenter',
  'loadingPositionStart',
  'loadingPositionEnd',
]);

export default buttonClasses;
```

**Architecture Pattern**:
- TypeScript interface ensures type safety for class names
- `generateUtilityClasses` creates BEM-style class names (`Mui${Component}__${slot}`)
- Exported as constant to enable CSS class reuse across component styles
- Single source of truth for all class names

---

## 4. Composition Pattern: TextField

**File**: `packages/mui-material/src/TextField/TextField.js`

TextField demonstrates composition of multiple base components:

```javascript
const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
};

const TextField = React.forwardRef(function TextField(inProps, ref) {
  const props = useDefaultProps({ props: inProps, name: 'MuiTextField' });
  const {
    autoComplete,
    autoFocus = false,
    children,
    className,
    color = 'primary',
    defaultValue,
    disabled = false,
    error = false,
    fullWidth = false,
    helperText,
    id: idOverride,
    inputRef,
    label,
    maxRows,
    minRows,
    multiline = false,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required = false,
    rows,
    select = false,
    slots = {},
    slotProps = {},
    type,
    value,
    variant = 'outlined',
    ...other
  } = props;

  const ownerState = {
    ...props,
    autoFocus,
    color,
    disabled,
    error,
    fullWidth,
    multiline,
    required,
    select,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  // Runtime validation in development
  if (process.env.NODE_ENV !== 'production') {
    if (select && !children) {
      console.error(
        'MUI: `children` must be passed when using the `TextField` component with `select`.',
      );
    }
  }

  const id = useId(idOverride);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;
  const InputComponent = variantComponent[variant];

  const externalForwardedProps = {
    slots,
    slotProps,
  };

  // Use slot system for flexible composition
  const [SelectSlot, selectProps] = useSlot('select', {
    elementType: Select,
    externalForwardedProps,
    ownerState,
  });

  const [RootSlot, rootProps] = useSlot('root', {
    elementType: TextFieldRoot,
    shouldForwardComponentProp: true,
    externalForwardedProps: {
      ...externalForwardedProps,
      ...other,
    },
    ownerState,
    className: clsx(classes.root, className),
    ref,
    additionalProps: {
      disabled,
      error,
      fullWidth,
      required,
      color,
      variant,
    },
  });

  const [InputSlot, inputProps] = useSlot('input', {
    elementType: InputComponent,
    externalForwardedProps,
    additionalProps: inputAdditionalProps,
    ownerState,
  });

  return (
    <RootSlot {...rootProps}>
      {label != null && label !== '' && (
        <InputLabelSlot
          htmlFor={select && !nativeSelect ? undefined : id}
          id={inputLabelId}
          {...(select && !nativeSelect && { component: 'div' })}
          {...inputLabelProps}
        >
          {label}
        </InputLabelSlot>
      )}

      {select ? (
        <SelectSlot
          aria-describedby={helperTextId}
          id={id}
          labelId={inputLabelId}
          value={value}
          input={InputElement}
          {...selectProps}
        >
          {children}
        </SelectSlot>
      ) : (
        InputElement
      )}

      {helperText && (
        <FormHelperTextSlot id={helperTextId} {...formHelperTextProps}>
          {helperText}
        </FormHelperTextSlot>
      )}
    </RootSlot>
  );
});
```

**Key Patterns**:
- Component selection via object map (`variantComponent`)
- Runtime validation in development environment
- Slot system (`useSlot`) enables high customization without exposing complexity
- Proper ID management for accessibility (`helperTextId`, `inputLabelId`)

---

## 5. Advanced Hook Pattern: useSlot

**File**: `packages/mui-material/src/utils/useSlot.ts`

The slot system is the core composition mechanism:

```typescript
export default function useSlot<
  T extends string,
  ElementType extends React.ElementType,
  SlotProps,
  OwnerState extends {},
  ExternalSlotProps extends {
    component?: React.ElementType | undefined;
    ref?: React.Ref<any> | undefined;
  },
  ExternalForwardedProps extends {
    component?: React.ElementType | undefined;
    slots?: { [k in T]?: React.ElementType } | undefined;
    slotProps?:
      | {
          [k in T]?: ExternalSlotProps | ((ownerState: OwnerState) => ExternalSlotProps);
        }
      | undefined;
  },
  AdditionalProps,
  SlotOwnerState extends {},
>(
  name: T,
  parameters: (T extends 'root'
    ? { ref: React.ForwardedRef<any> }
    : { ref?: React.ForwardedRef<any> | undefined }) & {
    className: ClassValue | ClassValue[];
    elementType: ElementType;
    ownerState: OwnerState;
    externalForwardedProps: ExternalForwardedProps;
    getSlotProps?: ((other: EventHandlers) => WithCommonProps<SlotProps>) | undefined;
    additionalProps?: WithCommonProps<AdditionalProps> | undefined;
    internalForwardedProps?: any;
    shouldForwardComponentProp?: boolean | undefined;
  },
) {
  const {
    className,
    elementType: initialElementType,
    ownerState,
    externalForwardedProps,
    internalForwardedProps,
    shouldForwardComponentProp = false,
    ...useSlotPropsParams
  } = parameters;
  
  const {
    component: rootComponent,
    slots = { [name]: undefined },
    slotProps = { [name]: undefined },
    ...other
  } = externalForwardedProps;

  // Resolve the actual element type from user overrides
  const elementType = slots[name] || initialElementType;

  // Resolve slotProps which can be a callback
  const resolvedComponentsProps = resolveComponentProps(slotProps[name], ownerState);

  const {
    props: { component: slotComponent, ...mergedProps },
    internalRef,
  } = mergeSlotProps({
    className,
    ...useSlotPropsParams,
    externalForwardedProps: name === 'root' ? other : undefined,
    externalSlotProps: resolvedComponentsProps,
  });

  const ref = useForkRef(internalRef, resolvedComponentsProps?.ref, parameters.ref);

  const LeafComponent = (name === 'root' ? slotComponent || rootComponent : slotComponent) as
    | React.ElementType
    | undefined;

  const props = appendOwnerState(
    elementType,
    {
      ...(name === 'root' && !rootComponent && !slots[name] && internalForwardedProps),
      ...(name !== 'root' && !slots[name] && internalForwardedProps),
      ...mergedProps,
      ...(LeafComponent &&
        !shouldForwardComponentProp && {
          as: LeafComponent,
        }),
      ...(LeafComponent &&
        shouldForwardComponentProp && {
          component: LeafComponent,
        }),
      ref,
    },
    ownerState,
  );

  return [elementType, props] as [ElementType, SlotProps & ExternalSlotProps];
}
```

**Key Patterns**:
- Generic type parameters encode slot contracts
- Root slot has special handling (spreads `externalForwardedProps`)
- `slotProps[name]` can be a function receiving `ownerState`
- `shouldForwardComponentProp` distinguishes between styled components and regular elements
- Returns tuple of `[SlotComponent, resolvedProps]`

---

## 6. Modal Component: Advanced State Management

**File**: `packages/mui-material/src/Modal/Modal.js`

```javascript
const Modal = React.forwardRef(function Modal(inProps, ref) {
  const props = useDefaultProps({ name: 'MuiModal', props: inProps });
  const {
    classes: classesProp,
    className,
    closeAfterTransition = false,
    children,
    container,
    component,
    disableAutoFocus = false,
    disableEnforceFocus = false,
    disablePortal = false,
    disableRestoreFocus = false,
    disableScrollLock = false,
    hideBackdrop = false,
    keepMounted = false,
    onClose,
    onTransitionEnter,
    onTransitionExited,
    open,
    slotProps = {},
    slots = {},
    theme,
    ...other
  } = props;

  const propsWithDefaults = {
    ...props,
    closeAfterTransition,
    disableAutoFocus,
    disableEnforceFocus,
    disablePortal,
    disableRestoreFocus,
    disableScrollLock,
    hideBackdrop,
    keepMounted,
  };

  // Custom hook managing modal state, focus trap, and transitions
  const {
    getRootProps,
    getBackdropProps,
    getTransitionProps,
    portalRef,
    isTopModal,
    exited,
    hasTransition,
  } = useModal({
    ...propsWithDefaults,
    rootRef: ref,
  });

  const ownerState = {
    ...propsWithDefaults,
    exited,
  };

  const classes = useUtilityClasses(ownerState);

  // Prepare props for children (transition component)
  const childProps = {};
  if (children.props.tabIndex === undefined) {
    childProps.tabIndex = '-1';
  }

  // Inject transition handlers if needed
  if (hasTransition) {
    const { onEnter, onExited } = getTransitionProps();
    childProps.onEnter = onEnter;
    childProps.onExited = onExited;
  }

  const externalForwardedProps = { slots, slotProps };

  const [RootSlot, rootProps] = useSlot('root', {
    ref,
    // ... slot configuration
  });

  // Portal: renders outside DOM hierarchy
  return (
    <Portal disablePortal={disablePortal} container={container} ref={portalRef}>
      <RootSlot {...rootProps}>
        <FocusTrap
          disableAutoFocus={disableAutoFocus}
          disableEnforceFocus={disableEnforceFocus}
          disableRestoreFocus={disableRestoreFocus}
          isEnabled={isTopModal}
          open={open}
        >
          {React.cloneElement(children, childProps)}
        </FocusTrap>
        {!hideBackdrop && (
          <BackdropSlot {...backdropProps} />
        )}
      </RootSlot>
    </Portal>
  );
});
```

**Key Patterns**:
- `useModal` custom hook encapsulates complex state management
- Focus trap for accessibility
- Portal prevents z-index stacking issues
- Transition handlers injected via `React.cloneElement`
- Props separated into semantic groups (`closeAfterTransition`, `disableAutoFocus`, etc.)

---

## 7. Custom Hook Pattern: useAutocomplete

**File**: `packages/mui-material/src/useAutocomplete/useAutocomplete.js`

Advanced hook with validation, filtering, and keyboard handling:

```javascript
export function createFilterOptions(config = {}) {
  const {
    ignoreAccents = true,
    ignoreCase = true,
    limit,
    matchFrom = 'any',
    stringify,
    trim = false,
  } = config;

  return (options, { inputValue, getOptionLabel }) => {
    let input = trim ? inputValue.trim() : inputValue;
    if (ignoreCase) {
      input = input.toLowerCase();
    }
    if (ignoreAccents) {
      input = stripDiacritics(input);
    }

    const filteredOptions = !input
      ? options
      : options.filter((option) => {
          let candidate = (stringify || getOptionLabel)(option);
          if (ignoreCase) {
            candidate = candidate.toLowerCase();
          }
          if (ignoreAccents) {
            candidate = stripDiacritics(candidate);
          }

          return matchFrom === 'start' ? candidate.startsWith(input) : candidate.includes(input);
        });

    return typeof limit === 'number' ? filteredOptions.slice(0, limit) : filteredOptions;
  };
}

function useAutocomplete(props) {
  const {
    unstable_isActiveElementInListbox = defaultIsActiveElementInListbox,
    unstable_classNamePrefix = 'Mui',
    autoComplete = false,
    autoHighlight = false,
    autoSelect = false,
    blurOnSelect = false,
    clearOnBlur = !props.freeSolo,
    clearOnEscape = false,
    componentName = 'useAutocomplete',
    defaultValue = props.multiple ? MULTIPLE_DEFAULT_VALUE : null,
    disableClearable = false,
    disableCloseOnSelect = false,
    disabled: disabledProp,
    disabledItemsFocusable = false,
    disableListWrap = false,
    filterOptions = defaultFilterOptions,
    filterSelectedOptions = false,
    freeSolo = false,
    getOptionDisabled,
    getOptionKey,
    getOptionLabel: getOptionLabelProp = (option) => option.label ?? option,
    groupBy,
    handleHomeEndKeys = !props.freeSolo,
    id: idProp,
    includeInputInList = false,
    inputValue: inputValueProp,
    isOptionEqualToValue = defaultIsOptionEqualToValue,
    multiple = false,
    onChange,
    onClose,
    onHighlightChange,
    onInputChange,
    onOpen,
    open: openProp,
    openOnFocus = false,
    options,
    readOnly = false,
    renderValue,
    resetHighlightOnMouseLeave = false,
    selectOnFocus = !props.freeSolo,
    value: valueProp,
  } = props;

  const id = useId(idProp);

  // Validation: getOptionLabel must return a string
  let getOptionLabel = getOptionLabelProp;

  getOptionLabel = (option) => {
    const optionLabel = getOptionLabelProp(option);
    if (typeof optionLabel !== 'string') {
      if (process.env.NODE_ENV !== 'production') {
        const erroneousReturn =
          optionLabel === undefined ? 'undefined' : `${typeof optionLabel} (${optionLabel})`;
        console.error(
          `MUI: The \`getOptionLabel\` method of ${componentName} returned ${erroneousReturn} instead of a string for ${JSON.stringify(
            option,
          )}.`,
        );
      }
      return String(optionLabel);
    }
    return optionLabel;
  };

  const ignoreFocus = React.useRef(false);
  // ... state management continues
}
```

**Key Patterns**:
- Factory pattern: `createFilterOptions` returns specialized filter function
- Type validation with fallback (returns `String(optionLabel)`)
- Configuration object with sensible defaults
- Dev-only console errors with detailed context
- Flexible handlers: `unstable_isActiveElementInListbox` allows user customization

---

## 8. Error Handling & Validation Utilities

**File**: `packages/mui-utils/src/createChainedFunction/createChainedFunction.ts`

Safe function composition:

```typescript
/**
 * Safe chained function.
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 */
export default function createChainedFunction<Args extends any[], This>(
  ...funcs: Array<(this: This, ...args: Args) => any>
): (this: This, ...args: Args) => void {
  return funcs.reduce(
    (acc, func) => {
      if (func == null) {
        return acc;
      }

      return function chainedFunction(...args) {
        acc.apply(this, args);
        func.apply(this, args);
      };
    },
    () => {},
  );
}
```

**Pattern**:
- Null-safe: ignores `null` or `undefined` functions
- Creates new function only when necessary
- Preserves `this` context across chained calls
- Used for combining `onClick`, `onChange`, etc.

---

## 9. Composition Pattern: Box Component

**File**: `packages/mui-material/src/Box/Box.js`

Minimal wrapper around system's `createBox`:

```javascript
const defaultTheme = createTheme();

const Box = createBox({
  themeId: THEME_ID,
  defaultTheme,
  defaultClassName: boxClasses.root,
  generateClassName: ClassNameGenerator.generate,
});

Box.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default Box;
```

**Pattern**:
- Delegates to `@mui/system` for core functionality
- Custom theme ID for CSS variable scoping
- Custom class name generator for consistency
- `sx` prop supports object, function, or array

---

## 10. Theme System: createTheme

**File**: `packages/mui-material/src/styles/createTheme.ts`

```typescript
export interface ThemeOptions extends CssVarsOptions, Omit<CssVarsThemeOptions, CssVarsConfigList> {
  cssVariables?: boolean | Pick<CssVarsThemeOptions, CssVarsConfigList> | undefined;
  palette?: PaletteOptions | undefined;
}

// eslint-disable-next-line consistent-return
function attachColorScheme(
  theme: { colorSchemes?: Partial<Record<string, any>> | undefined },
  scheme: 'light' | 'dark',
  colorScheme: boolean | Record<string, any> | undefined,
) {
  if (!theme.colorSchemes) {
    return undefined;
  }
  if (colorScheme) {
    theme.colorSchemes[scheme] = {
      ...(colorScheme !== true && colorScheme),
      palette: createPalette({
        ...(colorScheme === true ? {} : colorScheme.palette),
        mode: scheme,
      } as any),
    };
  }
}

export default function createTheme(
  options: ThemeOptions = {} as any,
  ...args: object[]
): Theme {
  const {
    palette,
    cssVariables = false,
    colorSchemes: initialColorSchemes = !palette ? { light: true } : undefined,
    defaultColorScheme: initialDefaultColorScheme = palette?.mode,
    ...other
  } = options;
  
  const defaultColorSchemeInput = (initialDefaultColorScheme as DefaultColorScheme) || 'light';
  const defaultScheme = initialColorSchemes?.[defaultColorSchemeInput];
  const colorSchemesInput = {
    ...initialColorSchemes,
    ...(palette
      ? {
          [defaultColorSchemeInput]: {
            ...(typeof defaultScheme !== 'boolean' && defaultScheme),
            palette,
          },
        }
      : undefined),
  };

  if (cssVariables === false) {
    if (!('colorSchemes' in options)) {
      // Behaves exactly as v5
      return createThemeNoVars(options as ThemeNoVarsOptions, ...args);
    }
    // ... rest of theme creation
  }
}
```

**Key Patterns**:
- Color scheme support (light/dark mode) with CSS variables
- Backward compatibility with v5 when `cssVariables` is false
- Palette creation with color scheme awareness
- Variadic args for deep merging multiple theme objects

---

## 11. Hook Pattern: useMediaQuery

**File**: `packages/mui-material/src/useMediaQuery/index.js`

Delegated to `@mui/system`:

```javascript
import { unstable_createUseMediaQuery } from '@mui/system/useMediaQuery';
import THEME_ID from '../styles/identifier';

const useMediaQuery = unstable_createUseMediaQuery({ themeId: THEME_ID });

export default useMediaQuery;
```

**Pattern**:
- Thin wrapper for consistent theme integration
- Theme ID ensures breakpoints are resolved from MUI theme
- Delegates heavy lifting to system package

---

## 12. Architectural Insights

### 2.1 ownerState Pattern
Every Material-UI component maintains `ownerState` as a single source of truth:
- Extracted from props in component body
- Passed to styled components
- Used by `useUtilityClasses` for conditional class generation
- Enables theme overrides to be responsive to component state

### 2.2 Slot System
The slot system (`useSlot`) enables:
- Component replacement via `slots` prop
- Props customization via `slotProps` (including callbacks)
- Leaf component customization
- Clean separation of internal and external overrides

### 2.3 styled() Configuration
Styled components include three key options:
- `shouldForwardProp`: prevents unwanted DOM attributes
- `overridesResolver`: enables theme-based style overrides
- `name` and `slot`: for class generation and debugging

### 2.4 Prop Merging Strategy
```
Props Priority: inProps > contextProps > themeDefaultProps
```
Implemented via:
- `React.useContext()` for button groups, field variants
- `resolveProps()` for context merging
- `useDefaultProps()` for theme defaults

### 2.5 Development Validation
```javascript
if (process.env.NODE_ENV !== 'production') {
  // Validation code
  console.error('MUI: ...');
}
```
Tree-shaken in production, provides developer guidance in dev mode.

---

## Summary of Key Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **ownerState** | Single source of truth for component state | Button: `{ color, variant, size, ... }` |
| **useUtilityClasses** | Dynamic CSS class composition | Conditional class arrays based on props |
| **useSlot** | Flexible component composition | TextField: select/input/label slots |
| **overridesResolver** | Theme-based style customization | Resolve styles based on ownerState |
| **memoTheme** | Prevent theme-dependent re-renders | Wrap styled function callback |
| **slots/slotProps** | User-facing component customization | Replace internal components |
| **Portal** | Escape CSS hierarchy (modals, menus) | Modal renders outside parent |
| **FocusTrap** | Accessibility: contain focus | Modal, Dialog components |
| **createFilterOptions** | Configurable filtering factory | Autocomplete filtering |
| **CSS Variables** | Theme variable support | `(theme.vars \|\| theme).palette.primary` |

---

**Document compiled**: 2026-06-28 17:17 UTC  
**Material-UI repository**: https://github.com/mui/material-ui  
**Primary version**: Master branch (latest development)
