# Claude Design Auditor Skill — Code Snippets & Implementation Patterns
**Source:** https://github.com/Ashutos1997/claude-design-auditor-skill  
**Version:** 1.2.13  
**Snapshot Date:** 2026-07-07

---

## 1. Main Entry Point: SKILL.md Structure

The skill operates as a callable design audit system with these frontmatter properties:

```yaml
---
name: design-auditor
version: 1.2.13
description: "Audit designs against 19 rules across Figma files and code 
  (HTML/CSS/React/Vue/Tailwind). Auto-detects framework and design system 
  (MUI, Chakra, shadcn/ui, Ant Design, Radix, Bootstrap). Runs code superpowers 
  across all 19 categories: aria, focus, contrast, tokens, responsive, motion, 
  forms, navigation, spacing, states, microcopy, elevation, iconography/SVG. 
  Flags color blindness risk. Audits dark patterns, ethical design, 
  Nielsen's heuristics."
---
```

**Core workflow:**
```
Step 0: Language Detection → Beginner Check
  ↓
Step 1: Gather Design (Figma/URL/Code/Screenshot)
  ↓
Step 1b: Smart Defaults (infer scope, stage, WCAG level)
  ↓
Step 1.5: Set Confidence Level
  ↓
Step 1.6: Framework Detection (React/Vue/HTML/Tailwind/MUI/etc.)
  ↓
Step 2: Run 19 Categories of Audit
  ↓
Step 3: Score & Report (using strict template)
  ↓
Step 4: Next Actions (fixes, re-audit, design system)
```

---

## 2. Input Handling Patterns

### 2.1 Input Type Detection

**Pattern: URL Decision Tree**

```typescript
// Decision tree for different input types:
input_type = detectInputType(userInput)

switch(input_type) {
  case "figma_url":
    → Follow Figma MCP Workflow (F0–F5)
    confidence = "🟢 High"
    
  case "live_url":
    → Fetch via web_fetch, treat as code input
    confidence = "🟡 Medium"
    limitations = "Cannot see non-rendered states (hover, focus, error, loading)"
    
  case "github_url":
    → Convert to raw URL, fetch content
    confidence = "🟢 High (file)" or "🟡 Medium (repo)"
    
  case "screenshot":
    confidence = "🟡 Medium"
    deduction_modifier = −50% (visual estimates only)
    skip_categories = ["Design Tokens", "exact Typography"]
    
  case "code":
    confidence = "🟢 High"
    run = Framework Detection (see 2.2)
    
  case "description_only":
    confidence = "🔴 Low"
    action = ask_for_visuals()
    skip_scored_audit = true
}
```

### 2.2 Framework Detection Algorithm

**Pattern: Cascading signal matching**

```javascript
// Run AFTER extracting code content
detectFramework(codeContent) {
  const signals = {
    
    // React/JSX signals
    hasReact: (
      codeContent.includes('import React') ||
      codeContent.includes('import { useState }') ||
      /jsx|tsx/i.test(fileExtension)
    ),
    hasJSX: /[<>][\w.]+ /g.test(codeContent),
    
    // Vue signals
    hasVue: (
      codeContent.includes('<template>') ||
      codeContent.includes('<script setup>') ||
      codeContent.includes('v-bind') ||
      /\.vue/.test(fileExtension)
    ),
    
    // Tailwind CSS signals
    hasTailwind: /className=["'].*?(text-|bg-|p-|m-|gap-|rounded-)/g.test(codeContent),
    
    // Design system detection
    hasMUI: codeContent.includes("@mui/material") || codeContent.includes("@mui/joy"),
    hasChakra: codeContent.includes("@chakra-ui/react"),
    hasShadcn: codeContent.includes("@/components/ui/"),
    hasAntDesign: codeContent.includes("from 'antd'"),
    hasRadix: codeContent.includes("@radix-ui/react"),
    hasBootstrap: (
      codeContent.includes("class=\"btn") || 
      codeContent.includes("from 'react-bootstrap'")
    ),
    
    // CSS-in-JS
    hasStyledComponents: codeContent.includes("styled.") || codeContent.includes("css`"),
    hasEmotion: codeContent.includes("@emotion"),
    
    // Custom tokens
    hasCSSCustomProperties: /:root\s*\{\s*--.+:/g.test(codeContent),
    
    // Vanilla HTML
    isVanillaHTML: (
      codeContent.includes('<div') && 
      !signals.hasReact && 
      !signals.hasVue
    )
  };
  
  // Return hierarchy (most specific first)
  if (signals.hasReact && signals.hasMUI && signals.hasTailwind)
    return "React + MUI v5 + Tailwind CSS";
  
  if (signals.hasReact && signals.hasShadcn && signals.hasTailwind)
    return "React + shadcn/ui + Tailwind CSS";
  
  if (signals.hasVue && signals.hasAntDesign)
    return "Vue 3 + Ant Design";
  
  // Fallback
  if (signals.hasReact) return "React / JSX";
  if (signals.hasVue) return "Vue";
  if (signals.isVanillaHTML) return "Vanilla HTML/CSS";
  
  return "Unknown — custom framework";
}

// Declare at top of audit report:
console.log(`Detected: ${detectFramework(code)}`);
```

### 2.3 Design System Detection

**Pattern: Import/usage-based identification**

```javascript
detectDesignSystem(codeContent, packageJson) {
  
  // Check package.json first (faster signal)
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  if ("@mui/material" in deps || "@mui/joy" in deps) {
    return {
      name: "MUI",
      version: deps["@mui/material"] || deps["@mui/joy"],
      issues: {
        // MUI-specific issue types
        "focus-override": "🔴 button:focus { outline: none } overriding MUI's focus-visible",
        "hardcoded-colors": "🟡 Use theme.palette.primary.main instead of hex",
        "sx-prop-optimization": "🟢 Use theme.components.MuiButton.styleOverrides"
      }
    };
  }
  
  if ("@chakra-ui/react" in deps) {
    return {
      name: "Chakra UI",
      issues: {
        "arbitrary-spacing": "🟡 <Box p='13px'> should use Chakra scale: <Box p={3}> (12px)",
        "hardcoded-colors": "🟡 Use Chakra color scheme ('gray.700') not hex ('#374151')",
        "scale-check": "Chakra spacing: 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, ..."
      }
    };
  }
  
  if ("@/components/ui/" in codeContent || "clsx" in deps || "tailwind-merge" in deps) {
    return {
      name: "shadcn/ui",
      issues: {
        "className-override": "🟡 Use cn() utility for class merging, not direct overrides",
        "variant-consistency": "🟡 Use variant prop or cva() for extensions"
      }
    };
  }
  
  if ("antd" in deps) {
    return {
      name: "Ant Design",
      issues: {
        "config-provider": "🟡 Override via ConfigProvider, not direct style props",
        "form-association": "🟡 Form.Item without name prop breaks label/input association"
      }
    };
  }
  
  if ("@radix-ui" in deps) {
    return {
      name: "Radix UI",
      issues: {
        "headless-primitive": "Use as a base for custom components; no built-in styling"
      }
    };
  }
  
  return { name: "None detected — custom/vanilla", issues: {} };
}
```

---

## 3. Core Audit Categories Implementation

### 3.1 CATEGORY 1: Typography Extraction (Code Path)

**Pattern: Font-size collection and role mapping**

```javascript
// Extract all font-size values from code/Figma
extractTypography(sourceData, framework) {
  
  let fontSizes = new Set();
  
  if (framework === "React/Tailwind") {
    // Parse className attributes: text-sm, text-lg, etc.
    const tailwindMatches = sourceData.match(/text-(xs|sm|base|lg|xl|2xl|3xl)/g);
    tailwindMatches?.forEach(m => {
      const scale = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 };
      fontSizes.add(scale[m.replace('text-', '')]);
    });
    
    // Also extract arbitrary values: text-[14px]
    sourceData.match(/text-\[\d+px\]/g)?.forEach(m => {
      const px = m.match(/\d+/)[0];
      fontSizes.add(parseInt(px));
    });
  }
  
  if (framework === "React/styled-components") {
    // Parse template strings: fontSize: '16px', fontSize: '1rem'
    sourceData.match(/fontSize:\s*['"]?(\d+\.?\d*)(px|rem|em)['"]?/g)?.forEach(m => {
      const [_, value, unit] = m.match(/(\d+\.?\d*)(px|rem|em)/);
      const px = unit === 'rem' ? parseFloat(value) * 16 : parseInt(value);
      fontSizes.add(px);
    });
  }
  
  if (framework === "Vanilla HTML/CSS") {
    // Parse CSS: font-size: 16px;
    sourceData.match(/font-size:\s*(\d+\.?\d*)(px|rem|em|pt)/g)?.forEach(m => {
      const [_, value, unit] = m.match(/(\d+\.?\d*)(px|rem|em|pt)/);
      const px = unit === 'rem' ? parseFloat(value) * 16 : parseInt(value);
      fontSizes.add(px);
    });
  }
  
  // Sort descending and assign roles
  const sorted = Array.from(fontSizes).sort((a, b) => b - a);
  
  return {
    all: sorted,
    hierarchy: {
      heading: sorted[0],           // largest
      subheading: sorted[1],         // second largest
      body: findMostFrequent(sorted),
      caption: sorted[sorted.length - 1]  // smallest
    },
    coverage: sorted.length,
    gridCompliance: sorted.map(size => ({
      value: size,
      onGrid: size % 2 === 0,
      status: size % 8 === 0 ? "✅ 8pt" : size % 4 === 0 ? "✅ 4pt" : "🟡 off-grid"
    }))
  };
}
```

### 3.2 CATEGORY 2: Color Contrast (WCAG Calculation)

**Pattern: Programmatic contrast ratio computation**

```javascript
// Compute WCAG contrast ratio from two hex colors
computeContrast(hexForeground, hexBackground) {
  
  // 1. Normalize hex to RGB (0–1 range)
  const toRGB = (hex) => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    return {
      r: (rgb >> 16) & 255,
      g: (rgb >> 8) & 255,
      b: rgb & 255
    };
  };
  
  const fg = toRGB(hexForeground);
  const bg = toRGB(hexBackground);
  
  // 2. Compute relative luminance (WCAG formula)
  const getLuminance = (channel) => {
    const c = channel / 255;
    return c <= 0.03928 
      ? c / 12.92 
      : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const L1 = 0.2126 * getLuminance(fg.r) + 
             0.7152 * getLuminance(fg.g) + 
             0.0722 * getLuminance(fg.b);
  
  const L2 = 0.2126 * getLuminance(bg.r) + 
             0.7152 * getLuminance(bg.g) + 
             0.0722 * getLuminance(bg.b);
  
  // 3. Compute contrast ratio
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  // 4. Compare against WCAG thresholds
  return {
    ratio: ratio.toFixed(2),
    passes: {
      'AA-normal-text': ratio >= 4.5,
      'AA-large-text': ratio >= 3.0,
      'AAA-normal-text': ratio >= 7.0,
      'AAA-large-text': ratio >= 4.5
    },
    recommendation: (
      ratio >= 7.0 ? "✅ AAA normal text" :
      ratio >= 4.5 ? "✅ AA normal text (AAA only for large)" :
      ratio >= 3.0 ? "✅ AA large text / UI components only" :
      "🔴 FAILS WCAG AA — increase contrast"
    )
  };
}

// Color blindness context generator
appendColorBlindnessNote(foreground, background) {
  
  // Detect pair type
  if (isRedGreenPair(foreground, background)) {
    return "⚠️ Deuteranopia/Protanopia risk — red and green indistinguishable for ~8% of men. " +
           "Add non-color signal: icon, pattern, or label.";
  }
  
  if (isBlueYellowPair(foreground, background)) {
    return "⚠️ Tritanopia risk — blue and yellow confused. Use contrast + shape cues.";
  }
  
  if (isLowSaturationPair(foreground, background)) {
    return "⚠️ Affects all color blindness types — low saturation. Increase contrast.";
  }
  
  return null; // no color blindness concern
}
```

### 3.3 CATEGORY 3: Spacing & Layout (8pt Grid)

**Pattern: Grid alignment checker with snap suggestions**

```javascript
// Check spacing against 8pt grid
checkSpacingGrid(value, gridBase = 8) {
  
  const tolerance = 0.5; // Allow ±0.5px for rounding
  const isOnGrid = (val, base) => {
    const remainder = val % base;
    return remainder === 0 || remainder <= tolerance || remainder >= base - tolerance;
  };
  
  const isOnEightPt = isOnGrid(value, 8);
  const isOnFourPt = isOnGrid(value, 4);
  
  // Find nearest valid values
  const nearest8pt = Math.round(value / 8) * 8;
  const nearest4pt = Math.round(value / 4) * 4;
  
  return {
    value: value,
    alignment: (
      isOnEightPt ? { status: "✅ 8pt grid", distance: 0 } :
      isOnFourPt ? { status: "✅ 4pt grid", distance: value % 4 } :
      { status: "🟡 off-grid", distance: Math.min(Math.abs(value - nearest8pt), Math.abs(value - nearest4pt)) }
    ),
    suggestions: {
      nearest8pt: nearest8pt,
      nearest4pt: nearest4pt
    },
    recommendation: isOnEightPt ? "no change needed" : `snap to ${nearest8pt}px`
  };
}

// Deduplicate repeated off-grid values
deduplicateSpacingIssues(allIssues) {
  const grouped = {};
  
  allIssues.forEach(issue => {
    const key = `${issue.value}px-appears-${issue.count}-times`;
    if (!grouped[key]) {
      grouped[key] = {
        value: issue.value,
        nodes: [],
        count: issue.count
      };
    }
    grouped[key].nodes.push(...issue.nodeIds);
  });
  
  return Object.values(grouped).map(group => ({
    severity: "🟡 Warning",
    title: `Off-grid spacing: ${group.value}px`,
    message: `Appears in ${group.count} places. Snap to ${snapTo8pt(group.value)}px.`,
    nodes: group.nodes,
    deduction: -4 // ONE issue, not multiple
  }));
}
```

### 3.4 CATEGORY 6: Accessibility (WCAG Checks)

**Pattern: Landmark-based accessibility audit**

```javascript
// Comprehensive accessibility checks on code
auditAccessibility(htmlCode, codeFramework) {
  
  const issues = [];
  
  // 1. Button aria-labels
  const buttonRegex = /<button[^>]*>([^<]*)<\/button>/g;
  let buttonMatch;
  while ((buttonMatch = buttonRegex.exec(htmlCode)) !== null) {
    const buttonTag = buttonMatch[0];
    const hasText = buttonMatch[1].trim().length > 0;
    const hasAriaLabel = buttonTag.includes('aria-label');
    
    if (!hasText && !hasAriaLabel) {
      issues.push({
        severity: "🔴 Critical",
        category: 6,
        message: "Icon button missing aria-label",
        code: buttonTag,
        line: getLineNumber(htmlCode, buttonMatch.index)
      });
    }
  }
  
  // 2. Image alt attributes
  const imgRegex = /<img[^>]*>/g;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(htmlCode)) !== null) {
    const imgTag = imgMatch[0];
    const hasAlt = imgTag.includes('alt=');
    
    if (!hasAlt) {
      issues.push({
        severity: "🔴 Critical",
        category: 6,
        message: "Image missing alt attribute",
        code: imgTag,
        line: getLineNumber(htmlCode, imgMatch.index)
      });
    }
  }
  
  // 3. Focus styles removal (outline: none)
  if (htmlCode.includes("outline: none") || htmlCode.includes("outline:none")) {
    issues.push({
      severity: "🔴 Critical",
      category: 6,
      message: "Focus styles removed with outline: none — keyboard users cannot see focus",
      suggestion: "Add :focus-visible with visible outline instead",
      deduction: -12 // Blocker: WCAG 2.4.7
    });
  }
  
  // 4. Form label association
  const inputRegex = /<input[^>]*id=["']([^"']+)["'][^>]*>/g;
  const labelRegex = /<label[^>]*for=["']([^"']+)["'][^>]*>/g;
  
  const inputIds = new Set();
  let inputMatch;
  while ((inputMatch = inputRegex.exec(htmlCode)) !== null) {
    inputIds.add(inputMatch[1]);
  }
  
  const labelFor = new Set();
  let labelMatch;
  while ((labelMatch = labelRegex.exec(htmlCode)) !== null) {
    labelFor.add(labelMatch[1]);
  }
  
  inputIds.forEach(id => {
    if (!labelFor.has(id)) {
      issues.push({
        severity: "🔴 Critical",
        category: 6,
        message: `Input id="${id}" not associated with <label>`,
        suggestion: `Add <label for="${id}"> or aria-label="${id}"`
      });
    }
  });
  
  // 5. SVG accessibility
  const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/g;
  let svgMatch;
  while ((svgMatch = svgRegex.exec(htmlCode)) !== null) {
    const svgTag = svgMatch[0];
    const isDecorative = svgTag.includes('aria-hidden="true"');
    const isLabeled = svgTag.includes('role="img"') && svgTag.includes('<title');
    
    if (!isDecorative && !isLabeled) {
      issues.push({
        severity: "🔴 Critical",
        category: 6,
        message: "SVG missing accessibility — add aria-hidden OR role='img' + <title>",
        example: `<svg aria-hidden="true" focusable="false">...</svg>`
      });
    }
  }
  
  return issues;
}
```

---

## 4. Psychology Heuristics & UX Patterns

### 4.1 Peak-End Rule (Category 11)

**Pattern: Completion screen analysis**

```javascript
// Peak-End Rule: Users judge entire flow by two moments
auditPeakEndRule(designFrames) {
  
  const issues = [];
  
  // Find the "end" (completion/success screen)
  const successFrame = designFrames.find(f => 
    f.name.toLowerCase().includes('success') ||
    f.name.toLowerCase().includes('complete') ||
    f.name.toLowerCase().includes('done')
  );
  
  if (!successFrame) {
    return issues; // No success screen found
  }
  
  // Check success screen content
  const textContent = extractTextNodes(successFrame);
  
  // Issue 1: Generic "Success" with no detail
  if (textContent.includes("Success") && textContent.length < 20) {
    issues.push({
      severity: "🟡 Warning",
      rule: "Peak-End Rule",
      message: "Success screen displays only generic 'Done' or 'Success' with no detail.",
      explanation: "The last screen of a flow shapes the user's memory of the whole " +
                   "experience. Add: what was completed, what happens next, positive signal.",
      fix: "Include: action name, confirmation detail, next step, positive visual (color/icon/animation)"
    });
  }
  
  // Issue 2: Auto-redirect before reading
  const redirectDelay = getAutoRedirectDelay(successFrame);
  if (redirectDelay && redirectDelay < 2000) {
    issues.push({
      severity: "🟡 Warning",
      rule: "Peak-End Rule",
      message: `Success screen auto-redirects in ${redirectDelay}ms — too fast to read`,
      fix: "Increase timeout to ≥ 2000ms, or require user interaction to proceed"
    });
  }
  
  // Issue 3: No positive visual signal
  const hasPositiveVisual = (
    successFrame.fills?.some(f => isPositiveColor(f.color)) ||  // green, blue, etc.
    successFrame.children?.some(c => c.name.includes('icon')) ||
    successFrame.children?.some(c => c.name.includes('animation'))
  );
  
  if (!hasPositiveVisual) {
    issues.push({
      severity: "🟡 Warning",
      rule: "Peak-End Rule",
      message: "Success screen has no positive visual signal (color, icon, illustration, animation)",
      fix: "Add: positive color palette, success icon, celebration animation, or congratulations illustration"
    });
  }
  
  // Positive: well-formed success screen
  if (hasPositiveVisual && textContent.length > 50 && (!redirectDelay || redirectDelay >= 2000)) {
    return {
      positive: "✅ Well-formed success screen with action name, next step, and positive visual signal"
    };
  }
  
  return issues;
}
```

### 4.2 Goal Gradient Theory (Category 11)

**Pattern: Progress indicator analysis**

```javascript
// Goal Gradient: People increase effort as they approach goal
// Progress indicators communicate proximity to completion
auditGoalGradient(multiStepFlow) {
  
  const issues = [];
  
  const stepCount = multiStepFlow.steps.length;
  
  if (stepCount < 3) {
    return issues; // Goal Gradient applies to 3+ step flows
  }
  
  // Issue 1: No progress indicator at all
  const hasProgressIndicator = multiStepFlow.children?.some(c =>
    c.name.includes('progress') || 
    c.name.includes('step') ||
    c.name.includes('stepper')
  );
  
  if (!hasProgressIndicator) {
    issues.push({
      severity: "🟡 Warning",
      rule: "Goal Gradient Theory",
      message: `${stepCount}-step flow with no visible progress indicator`,
      explanation: "No progress signal — users don't know how close they are to completion, " +
                   "reducing motivation and completion rates.",
      fix: "Add a step counter ('Step X of Y') or progress bar showing relative progress",
      deduction: -4
    });
  }
  
  // Issue 2: Progress counter without total
  const stepCounterText = extractProgressCounterText(multiStepFlow);
  if (stepCounterText && stepCounterText.includes("Step") && !stepCounterText.includes("of")) {
    issues.push({
      severity: "🟡 Warning",
      rule: "Goal Gradient Theory",
      message: "Step counter shows 'Step 3' without a total — users can't judge proximity",
      fix: "Show 'Step 3 of 5' so users know how close they are to completion",
      deduction: -4
    });
  }
  
  // Issue 3: Static progress bar (same fill regardless of step)
  const progressBar = multiStepFlow.children?.find(c => c.name.includes('progress'));
  if (progressBar && !isDynamicFill(progressBar)) {
    issues.push({
      severity: "🔴 Critical",
      rule: "Goal Gradient Theory",
      message: "Progress bar always shows the same fill — misleading, does not advance",
      explanation: "Users expect progress bar to increase per step. Static bar is broken UI.",
      fix: "Make bar fill proportional to current step: (currentStep / totalSteps) × 100%",
      deduction: -8
    });
  }
  
  // Positive: final step signals completion
  const finalStepName = multiStepFlow.steps[stepCount - 1]?.name || "";
  if (finalStepName.toLowerCase().includes("last") ||
      finalStepName.toLowerCase().includes("final") ||
      finalStepName.toLowerCase().includes("review")) {
    return {
      positive: "✅ Final step visually signals it's the last step (e.g., 'Last step', filled bar)"
    };
  }
  
  return issues;
}
```

### 4.3 Overchoice Paradox (Category 4)

**Pattern: Decision paralysis detection**

```javascript
// Overchoice Paradox: Too many undifferentiated choices reduce completion
// Paralysis increases with choice count when visual differentiation is absent
auditOverchoice(container, elementType = "button") {
  
  const issues = [];
  
  // Find all sibling interactive elements
  const siblings = container.children
    ?.filter(c => c.name.toLowerCase().includes(elementType))
    || [];
  
  if (siblings.length < 4) {
    return issues; // Overchoice applies to 4+ siblings
  }
  
  // Check if all siblings have IDENTICAL styling
  const firstSibling = siblings[0];
  const allIdentical = siblings.every(sibling =>
    sibling.fills?.length === firstSibling.fills?.length &&
    sibling.fills?.[0]?.color === firstSibling.fills?.[0]?.color &&
    sibling.typography?.fontSize === firstSibling.typography?.fontSize &&
    sibling.typography?.fontWeight === firstSibling.typography?.fontWeight
  );
  
  // Check if any is visually differentiated as primary
  const hasPrimaryDesignation = siblings.some(s =>
    s.name.toLowerCase().includes('primary') ||
    isVisuallyEmphasized(s)
  );
  
  if (allIdentical && !hasPrimaryDesignation) {
    const severity = siblings.length >= 6 ? "🔴 Critical" : "🟡 Warning";
    const deduction = siblings.length >= 6 ? -8 : -4;
    
    issues.push({
      severity: severity,
      rule: "Overchoice Paradox",
      message: `${siblings.length} equal-weight ${elementType}s with no primary action — ` +
               "decision paralysis risk",
      explanation: "Too many undifferentiated choices measurably reduce decision quality " +
                   "and completion rates. Users experience 'choice overload.'",
      fix: (
        siblings.length >= 6
          ? "Demote, group, or hide lower-priority options. Keep 1–3 primary CTAs visible."
          : "Establish one clear primary action — use color, weight, or size to differentiate."
      ),
      deduction: deduction
    });
  }
  
  // Exception: lists, nav, data tables are exempt
  if (isListOrTable(container)) {
    return issues; // Overchoice doesn't apply to content lists
  }
  
  return issues;
}
```

---

## 5. Design System–Specific Issue Detection

### 5.1 MUI (Material-UI) Overrides

**Pattern: Design system violation detector**

```javascript
// Detect common MUI override violations
auditMUIDesignSystem(cssCode, jsCode) {
  
  const issues = [];
  
  // Issue 1: Focus outline removed
  if (cssCode.includes(".MuiButton-root:focus") && cssCode.includes("outline: none")) {
    issues.push({
      severity: "🔴 Critical",
      system: "MUI",
      message: "Overriding MUI's focus-visible breaks keyboard accessibility",
      current: `.MuiButton-root:focus { outline: none; }`,
      fix: "Use theme.components.MuiButton.styleOverrides.root with :focus-visible targeting",
      correct: `theme: {
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                '&:focus-visible': {
                  outline: '2px solid blue'
                }
              }
            }
          }
        }
      }`,
      deduction: -12 // Blocker: accessibility violation
    });
  }
  
  // Issue 2: Hardcoded colors bypassing theme
  const hardcodedColorPattern = /color:\s*["']#[0-9a-f]{6}["']/gi;
  if (hardcodedColorPattern.test(jsCode)) {
    const matches = jsCode.match(hardcodedColorPattern) || [];
    if (matches.length > 0) {
      issues.push({
        severity: "🟡 Warning",
        system: "MUI",
        message: `${matches.length} hardcoded color value(s) bypassing theme.palette`,
        example: matches[0],
        fix: "Use theme.palette.primary.main, theme.palette.background.paper, etc.",
        deduction: -4
      });
    }
  }
  
  // Issue 3: sx prop sub-optimal
  if (jsCode.includes('sx={{ fontSize: "14px" }}')) {
    issues.push({
      severity: "🟢 Tip",
      system: "MUI",
      message: "sx prop can use typography tokens",
      current: `sx={{ fontSize: '14px' }}`,
      suggested: `sx={{ fontSize: 'body2.fontSize' }}`,
      deduction: -1
    });
  }
  
  return issues;
}
```

### 5.2 Chakra UI Violations

**Pattern: Chakra-specific checks**

```javascript
auditChakraDesignSystem(jsCode) {
  
  const issues = [];
  
  // Issue 1: Arbitrary spacing instead of scale
  const arbitrarySpacingPattern = /<Box\s+[^>]*p=["'](\d+)px["']/g;
  let match;
  while ((match = arbitrarySpacingPattern.exec(jsCode)) !== null) {
    const pixelValue = match[1];
    const chakraEquivalent = findChakraSpacingScale(pixelValue);
    
    issues.push({
      severity: "🟡 Warning",
      system: "Chakra UI",
      message: `Arbitrary spacing: p="${pixelValue}px" breaks Chakra's scale system`,
      chakraScale: {
        0: "0",
        1: "0.25rem (4px)",
        2: "0.5rem (8px)",
        3: "0.75rem (12px)",
        4: "1rem (16px)",
        5: "1.25rem (20px)"
        // ... etc
      },
      current: `<Box p="${pixelValue}px">`,
      suggested: `<Box p={${chakraEquivalent}}>`,
      deduction: -4
    });
  }
  
  // Issue 2: Hardcoded colors
  if (jsCode.includes('color="#') || jsCode.includes("color='#")) {
    issues.push({
      severity: "🟡 Warning",
      system: "Chakra UI",
      message: "Hardcoded hex color bypasses Chakra color scheme",
      fix: "Use Chakra color tokens: color='gray.700', color='blue.500', etc."
    });
  }
  
  return issues;
}
```

---

## 6. Error Handling & Graceful Fallbacks

### 6.1 Input Validation

**Pattern: Graceful degradation**

```javascript
// Graceful fallback when a tool/MCP is unavailable
handleToolUnavailability(toolName, userInput) {
  
  const fallbacks = {
    "figma_mcp": {
      message: "I can see you've shared a Figma link, but I don't have Figma MCP access " +
               "in this session. Could you export a screenshot or paste the relevant " +
               "CSS/component code? I can still run a full audit — I'll just note it as " +
               "🟡 Medium confidence since I won't have exact layer data.",
      confidence: "🟡 Medium",
      proceed: true,
      limitations: [
        "Cannot access layer structure",
        "Cannot read component health",
        "Cannot read exact token values",
        "Cannot apply fixes directly"
      ]
    },
    
    "figma_get_screenshot": {
      message: "Screenshot unavailable. I'll audit from layer context data only.",
      confidence: "🟡 Medium",
      skip_categories: ["Visual hierarchy details"],
      proceed: true
    },
    
    "web_fetch": {
      message: "Unable to fetch URL. Could you share the code directly or paste a screenshot?",
      confidence: "🔴 Low",
      proceed: false
    }
  };
  
  const fallback = fallbacks[toolName];
  
  if (!fallback) {
    return {
      action: "ask_for_alternative",
      message: `I couldn't access ${toolName}. Could you share your design another way?`
    };
  }
  
  return {
    proceed: fallback.proceed,
    confidence: fallback.confidence,
    message: fallback.message,
    limitations: fallback.limitations,
    skip_categories: fallback.skip_categories || []
  };
}
```

### 6.2 Parsing Failure Recovery

**Pattern: Partial audit recovery**

```javascript
// Recover from incomplete extraction
recoverFromPartialExtraction(extractedData, framework) {
  
  const recovered = {};
  
  // If font extraction failed, try visual estimation from screenshot
  if (!extractedData.typography && extractedData.screenshot) {
    recovered.typography = {
      source: "visual_estimation",
      confidence: "Low",
      note: "Typography extracted visually from screenshot — estimates only",
      estimate: estimateFromVisual(extractedData.screenshot)
    };
  }
  
  // If design system detection failed, default to "none"
  if (!extractedData.designSystem) {
    recovered.designSystem = {
      name: "None detected",
      issues: [],
      note: "Design system checks skipped. Standard audit rules apply."
    };
  }
  
  // If color extraction failed, skip color contrast checks
  if (!extractedData.colors) {
    recovered.colors = null;
    recovered.skip_categories = ["Color & Contrast"];
    recovered.note = "Color contrast checks skipped — color data unavailable";
  }
  
  return recovered;
}
```

---

## 7. Configuration & Scope Selection

### 7.1 Audit Scope Inference

**Pattern: Smart scope selection**

```javascript
inferAuditScope(userMessage, designInput) {
  
  // Signal 1: Explicit scope in message
  const scopeSignals = {
    quick: userMessage.match(/quick|fast|just check|brief/i),
    full: userMessage.match(/full|everything|thorough|complete/i),
    custom: userMessage.match(/check|audit|review|only|specific/i)
  };
  
  // Signal 2: Input type indicators
  const typeSignals = {
    wireframe: (
      designInput.includes("greyscale") ||
      designInput.name?.includes("wireframe") ||
      isGrayscale(designInput)
    ),
    form: designInput.includes("input") || designInput.includes("form"),
    dashboard: designInput.includes("table") || designInput.includes("metric"),
    navigation: designInput.includes("nav") || designInput.includes("menu"),
    single_component: countFrames(designInput) === 1
  };
  
  // Signal 3: Stage inference
  const stageSignals = {
    early: isGrayscale(designInput) && isLowFidelity(designInput),
    dev_handoff: hasRealContent(designInput) && isPolished(designInput),
    production: userMessage.includes("live") || userMessage.includes("shipped")
  };
  
  // Determine scope
  let scope, stage, level;
  
  if (scopeSignals.quick) {
    scope = "Quick audit — 5 highest-risk categories";
  } else if (scopeSignals.full) {
    scope = "Full audit — all 19 categories";
  } else if (scopeSignals.custom) {
    scope = customCategories(userMessage);
  } else {
    scope = "Full audit"; // default
  }
  
  // Determine stage for severity thresholds
  if (stageSignals.production) {
    stage = "Production";
  } else if (stageSignals.dev_handoff) {
    stage = "Dev handoff";
  } else {
    stage = "Early concept";
  }
  
  // Infer WCAG level
  if (userMessage.match(/AAA|government|legal|enhanced/i)) {
    level = "AAA";
  } else {
    level = "AA"; // default
  }
  
  return {
    scope: scope,
    stage: stage,
    wcag_level: level,
    inferred: "Inferred: " + scope + " · " + stage + " · WCAG " + level
  };
}
```

### 7.2 Quick Audit Categories by Input Type

**Pattern: Dynamic selection based on input**

```javascript
selectQuickAuditCategories(inputType) {
  
  const selections = {
    
    "full_page_screenshot": [
      "Cat 2: Color & Contrast",
      "Cat 4: Visual Hierarchy & Focus",
      "Cat 1: Typography",
      "Cat 3: Spacing & Layout",
      "Cat 6: Accessibility"
    ],
    
    "form": [
      "Cat 6: Accessibility",
      "Cat 11: States & Feedback",
      "Cat 12: Microcopy",
      "Cat 2: Color & Contrast",
      "Cat 3: Spacing & Layout"
    ],
    
    "dashboard": [
      "Cat 4: Visual Hierarchy & Focus",
      "Cat 5: Consistency",
      "Cat 2: Color & Contrast",
      "Cat 1: Typography",
      "Cat 9: Responsiveness"
    ],
    
    "single_component": [
      "Cat 2: Color & Contrast",
      "Cat 6: Accessibility",
      "Cat 11: States & Feedback",
      "Cat 1: Typography",
      "Cat 3: Spacing & Layout"
    ],
    
    "navigation": [
      "Cat 6: Accessibility",
      "Cat 11: States & Feedback",
      "Cat 16: Navigation Patterns",
      "Cat 9: Responsiveness",
      "Cat 4: Visual Hierarchy & Focus"
    ]
  };
  
  return selections[inputType] || selections["single_component"];
}
```

---

## 8. Scoring Formula & Severity Definitions

### 8.1 Point Deduction System

**Pattern: Structured scoring**

```javascript
// Scoring calculation
calculateScore(issues) {
  
  let score = 100;
  
  const deductions = {
    "🚫 Blocker": 12,    // Legal/compliance violation
    "🔴 Critical": 8,    // Breaks usability/accessibility
    "🟡 Warning": 4,     // Degrades experience
    "🟢 Tip": 1          // Polish improvement
  };
  
  issues.forEach(issue => {
    const deduction = deductions[issue.severity];
    score -= deduction;
    
    console.log(`${issue.severity} — "${issue.title}" → −${deduction} pts`);
  });
  
  // Floor at 0
  score = Math.max(0, score);
  
  return {
    overall: score,
    formula: `100 − (${issues.filter(i => i.severity === "🚫 Blocker").length} × 12) ` +
             `− (${issues.filter(i => i.severity === "🔴 Critical").length} × 8) ` +
             `− (${issues.filter(i => i.severity === "🟡 Warning").length} × 4) ` +
             `− (${issues.filter(i => i.severity === "🟢 Tip").length} × 1) = ${score}/100`
  };
}

// Separate accessibility score (Categories 2, 6, 7, 15, 16)
calculateAccessibilityScore(allIssues) {
  
  const a11yCategories = [2, 6, 7, 15, 16];
  const a11yIssues = allIssues.filter(i => a11yCategories.includes(i.category));
  
  const score = calculateScore(a11yIssues);
  
  // Add compliance warning
  const hasBlockers = a11yIssues.some(i => i.severity === "🚫 Blocker");
  const band = (
    score.overall >= 90 ? "🟢 WCAG AA compliant — production-ready" :
    score.overall >= 70 ? "🟡 Minor gaps, no Blockers" :
    score.overall >= 50 ? "🔴 Significant gaps — likely has Blockers" :
    "🚫 Failing — legal risk, do not ship"
  );
  
  return {
    score: score.overall,
    band: band,
    hasBlockers: hasBlockers,
    warning: hasBlockers ? "⚠️ Contains legal compliance failures" : null
  };
}

// Ethics score (separate deduction formula)
calculateEthicsScore(issues) {
  
  let score = 100;
  
  // Different scale for ethics
  const ethicsDeductions = {
    "🔴 Deceptive": 15,      // Actively misleads or coerces
    "🟡 Questionable": 7,    // Exploitative depending on context
    "🟢 Noted": 0             // Persuasive but ethical
  };
  
  issues.forEach(issue => {
    const deduction = ethicsDeductions[issue.ethicsSeverity] || 0;
    score -= deduction;
  });
  
  return Math.max(0, score);
}
```

### 8.2 Severity Thresholds by Stage

**Pattern: Context-aware severity**

```javascript
// Apply different severity based on design stage
adjustSeverityByStage(issue, stage) {
  
  const severityMap = {
    "Early Concept": {
      "Missing hover/focus states": "🟢 Tip",      // relaxed
      "Placeholder content": "🟢 Tip",
      "Off-grid spacing": "🟢 Tip",
      "WCAG contrast failure": "🟡 Warning",      // still matters
      "Missing error states": "🟢 Tip"
    },
    
    "Dev Handoff": {
      "Missing hover/focus states": "🟡 Warning",  // stricter
      "Placeholder content": "🔴 Critical",       // can't ship
      "Off-grid spacing": "🟡 Warning",
      "WCAG contrast failure": "🔴 Critical",     // must be AA
      "Missing error states": "🟡 Warning"
    },
    
    "Production": {
      "Missing hover/focus states": "🔴 Critical", // strictest
      "Placeholder content": "🔴 Critical",
      "Off-grid spacing": "🟡 Warning",
      "WCAG contrast failure": "🚫 Blocker",      // legal risk
      "Missing error states": "🔴 Critical"
    }
  };
  
  const adjustedSeverity = severityMap[stage]?.[issue.title] || issue.severity;
  
  return {
    original: issue.severity,
    adjusted: adjustedSeverity,
    stage: stage,
    reason: `Severity adjusted for ${stage} stage`
  };
}
```

---

## 9. Report Template (Strict Structure)

### 9.1 Report Header Section

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍  DESIGN AUDIT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Field              | Value                                    |
|-------------------|------------------------------------------|
| Input             | Component name / frame name              |
| Type              | Figma MCP / HTML / React / Screenshot    |
| Framework         | React + Tailwind CSS                     |
| Confidence        | 🟢 High                                   |
| Design System     | MUI v5                                   |
| Token Coverage    | colors 80% · spacing 60% · radius 40%   |
| Component Health  | 68% coverage · 4 detached · 12 unnamed  |
| Auto Layout       | 92% frames · 2 manual-position frames    |
| Stage             | Dev handoff                              |
| WCAG Level        | AA                                       |
| Date              | 2026-07-07                               |

⚠️ **Medium confidence audit** — input was a screenshot. Values are estimated.
```

### 9.2 Scores Section

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊  SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall        [██████████░░░░░░░░░░]  72/100
Accessibility  [████████░░░░░░░░░░░░]  65/100  ⚠️ Contains legal compliance failures
Ethics         [███████████████░░░░░]  88/100
Usability      [████████████░░░░░░░░]  76/100  *(H1/H2/H3/H6/H7/H10)*

Formula: 100 − (1 × 🚫 12) − (2 × 🔴 8) − (4 × 🟡 4) − (1 × 🟢 1) = 72/100

**Key takeaway:** One legal accessibility violation (prefers-reduced-motion missing) 
and two critical issues (form labels missing) must be fixed before shipping.

### Score by Category

| Category | Score | Bar | 🚫 | 🔴 | 🟡 | 🟢 |
|---|---|---|---|---|---|---|
| 1 · Typography | 9/10 | █████████░ | 0 | 0 | 1 | 0 |
| 2 · Color & Contrast | 8/10 | ████████░░ | 0 | 0 | 1 | 1 |
| 3 · Spacing & Layout | 7/10 | ███████░░░ | 0 | 0 | 2 | 1 |
| 6 · Accessibility | 5/10 | █████░░░░░ | 1 | 2 | 1 | 0 |
| 11 · States & Feedback | 6/10 | ██████░░░░ | 0 | 1 | 1 | 0 |
```

### 9.3 Issues Sections

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫  BLOCKERS  ·  cannot ship  ·  −12pts each
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> **Missing prefers-reduced-motion handling**
> No @media (prefers-reduced-motion: reduce) found, but animations exist on hover/focus/load states.
> Fix: Add prefers-reduced-motion query across all CSS. Pattern:
> ```
> @media (prefers-reduced-motion: reduce) {
>   *, *::before, *::after {
>     animation-duration: 0.01ms !important;
>     transition-duration: 0.01ms !important;
>   }
> }
> ```
> Legal basis: WCAG 2.1 SC 2.3.3 Animation from Interactions
> Location: Line 34–56 (styles.css) · affects 8 animation properties

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴  CRITICAL ISSUES  ·  must fix  ·  −8pts each
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> **Form inputs missing visible labels**
> 6 input fields have no associated <label> element.
> Fix: Add <label for="[input-id]"> above or beside each input, OR add aria-label to <input>.
> Why: Screen readers cannot associate labels with inputs without proper markup.
> Location: Nodes 68:27912, 68:27927, 68:27943, 68:27950 (+2 more)

> **Missing error/empty/loading states on buttons**
> Primary submit button has no :disabled, :loading, or active state styling.
> Fix: Add visual feedback for button.disabled { opacity: 0.5; cursor: not-allowed; }
> Why: Users need feedback during form submission.
> Location: Lines 145–152 (Button.tsx)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡  WARNINGS  ·  should fix  ·  −4pts each
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> **Off-grid spacing: 13px** — appears in 4 places → Fix: Snap to 12px or 16px

> **No progress indicator on 4-step form** → Add "Step X of 4" counter or progress bar

> **Inconsistent border-radius across cards** — use 1 radius value throughout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢  TIPS  ·  nice to have  ·  −1pt each
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> **Font size 14px should align to 8pt grid** — use 12px or 16px for cleaner scale
> **SVG icons use 18px** — optical grid prefers 16px or 20px
```

---

## 10. Key Data Structures

### 10.1 Issue Object

```typescript
interface AuditIssue {
  // Identification
  id: string;
  category: number;               // 1–19
  severity: "🚫 Blocker" | "🔴 Critical" | "🟡 Warning" | "🟢 Tip";
  ethicsSeverity?: "🔴 Deceptive" | "🟡 Questionable" | "🟢 Noted";
  
  // Content
  title: string;
  message: string;
  explanation?: string;
  
  // Fix & context
  fix: string;
  why?: string;
  legalBasis?: string;            // e.g., "WCAG 2.1 SC 1.4.3"
  
  // Location
  nodeIds?: string[];             // Figma node IDs
  lineNumbers?: number[];         // Code line numbers
  nodeCount?: number;             // For deduplication
  
  // Scoring
  deduction: number;              // Calculated from severity
  confidence: "High" | "Medium" | "Low";
  
  // Metadata
  framework?: string;
  stage?: string;                 // "Early concept" | "Dev handoff" | "Production"
  wcagLevel?: string;             // "AA" | "AAA"
}
```

### 10.2 Audit Result Object

```typescript
interface AuditResult {
  metadata: {
    date: string;
    version: string;
    inputType: string;
    framework: string;
    designSystem: string;
    confidence: string;
  };
  
  scores: {
    overall: number;
    accessibility: number;
    ethics: number;
    usability: number;
    byCategory: Record<number, number>;
  };
  
  issues: AuditIssue[];
  
  positives: string[];           // min 2, max 4
  
  crossFrameInconsistencies?: Array<{
    property: string;
    frameA: { name: string; value: any };
    frameB: { name: string; value: any };
  }>;
  
  reauditDelta?: {
    prevScore: number;
    currentScore: number;
    change: number;
    fixed: string[];
    open: number;
    new: number;
  };
}
```

---

## 11. Session Standing Orders

```
/recap → RTK → observe issues → direct fixes → /rrr → commit → push → done
```

**RTK = Review-Then-Know:** Read memory first, understand context, execute audit

**RRR = Read-Rank-Recommend:** Organize findings by severity and impact

---

This comprehensive code snippets document captures the complete implementation patterns, core algorithms, psychology heuristics, and data structures that power the design-auditor skill. All patterns are extracted from the actual SKILL.md source and represent the real implementation logic.

**Last updated:** 2026-07-07 · Version 1.2.13
