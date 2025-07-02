# PatternFly Implementation Guide

This document details how PatternFly is specifically implemented in the Image Builder Frontend codebase, including current usage patterns, customizations, and migration considerations.

## 📦 **Current PatternFly Dependencies**

### Package Versions (package.json)
```json
{
  "@patternfly/patternfly": "6.1.0",
  "@patternfly/react-code-editor": "6.1.0", 
  "@patternfly/react-core": "6.1.0",
  "@patternfly/react-table": "6.1.0",
  "@patternfly/react-icons": "6.1.0" // devDependency
}
```

### Global CSS Imports
```typescript
// src/App.tsx & src/AppCockpit.tsx
import '@patternfly/patternfly/patternfly-addons.css';

// src/AppCockpit.tsx (Cockpit-specific)
import '@patternfly/react-core/dist/styles/base.css';
```

## 🏗️ **Import Patterns Used in Codebase**

### ✅ **Standard Import Pattern (Preferred)**
```typescript
// Named imports from specific modules
import { Button, Card, CardBody, FormGroup } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { ExternalLinkAltIcon, HelpIcon } from '@patternfly/react-icons';
```

### ⚠️ **Specific Imports (Used when needed)**
```typescript
// Deep imports for specific types/components
import { MenuToggleElement } from '@patternfly/react-core/dist/esm/components/MenuToggle/MenuToggle';
import { OnSetPage } from '@patternfly/react-core/dist/esm/components/Pagination/Pagination';
import { WizardStepType } from '@patternfly/react-core/dist/esm/components/Wizard';
```

### 🚨 **Deprecated Component Usage (Needs Migration)**
```typescript
// Current usage - NEEDS TO BE UPDATED
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';

// Found in these files:
// - ShareImageModal/ShareImageModal.tsx
// - Blueprints/BlueprintDiffModal.tsx
// - CreateImageWizard/steps/Packages/Packages.tsx
// - CreateImageWizard/steps/Review/Footer/CreateDropdown.tsx
// - And 5 more files...
```

## 🎨 **Custom Styling Implementation**

### ⚠️ **CRITICAL: PatternFly 6 Token System**
**PatternFly 6 introduced semantic tokens that replace global variables:**

```css
/* ✅ CORRECT - Use Semantic Tokens (PatternFly 6) */
background-color: var(--pf-t--global--background--color--100);
z-index: var(--pf-t--global--z-index--lg);
color: var(--pf-t--global--text--color--primary);
border-color: var(--pf-t--global--border--color--default);

/* ❌ LEGACY - Global Variables (may not work reliably) */
background-color: var(--pf-v6-global--palette--white);
z-index: var(--pf-v6-global--ZIndex--lg);
color: var(--pf-v6-global--Color--100);
border-color: var(--pf-v6-global--BorderColor--100);
```

**Token Structure**: `--pf-t--[scope]--[component]--[property]--[concept]--[variant]--[state]`
- **Scope**: `global` or `chart`
- **Component**: `background`, `text`, `icon`, `border`, `spacer`
- **Property**: `color`, `size`, `width`, `radius`
- **Concept**: `primary`, `status`, `action`
- **Variant**: `xs`, `sm`, `md`, `lg`, `xl`, `danger`, `warning`, `success`
- **State**: `default`, `hover`, `clicked`

**Migration Required**: Update existing global variables to tokens for reliable styling.

### PatternFly 6 Legacy CSS Variables (Update Required)
```scss
// src/Components/LandingPage/LandingPage.scss
.pf-c-form__group-label-help {
  color: var(--pf-v6-global--icon--Color--light);
}

.pf-c-form__group-label-help:active {
  color: var(--pf-v6-global--icon--Color--dark);
}

.expand-section {
  background-color: var(--pf-v6-global--palette--white);
}
```

### Wizard Customizations
```scss
// src/Components/CreateImageWizard/CreateImageWizard.scss

// Custom wizard navigation styling
.pf-v6-c-wizard__nav-list {
  padding-right: 0px;
}

// Form customizations
.pf-c-form {
  --pf-c-form--GridGap: var(--pf6-global--spacer--md);
}

.pf-c-form__group-label {
  --pf-c-form__group-label--PaddingBottom: var(--pf-v6-global--spacer--xs);
}

// Tile component focus states
.pf-c-tile:focus {
  --pf-c-tile__title--Color: var(--pf-c-tile__title--Color);
  --pf-c-tile__icon--Color: var(---pf-v6-global--Color--100);
  --pf-c-tile--before--BorderWidth: var(--pf-v6-global--BorderWidth--sm);
  --pf-c-tile--before--BorderColor: var(--pf-v6-global--BorderColor--100);
}

// Utility classes
.pf-v6-u-min-width {
  --pf-v6-u-min-width--MinWidth: 18ch;
}

.pf-v6-u-max-width {
  --pf-v6-u-max-width--MaxWidth: 26rem;
}
```

### Table Customizations
```scss
// src/Components/ImagesTable/ImagesTable.scss
.pf-m-expanded .no-bottom-border {
  border-bottom-style: none;
}

.ib-subdued-link {
  color: inherit;
  text-decoration: none;
  
  &:hover {
    color: inherit;
    text-decoration: none;
  }
}
```

## 🧩 **Component Usage Patterns**

### 1. **Sticky Header Implementation**
```typescript
// src/Components/sharedComponents/ImageBuilderHeader.tsx
// Current implementation using custom CSS positioning
export const ImageBuilderHeader = ({ activeTab }: ImageBuilderHeaderProps) => {
  return (
    <PageSection className="pf-v6-c-page__header" style={{ padding: 0 }}>
      {/* Header content */}
    </PageSection>
  );
};
```

```scss
// src/Components/sharedComponents/ImageBuilderHeader.scss
// Current implementation: Custom sticky positioning
.pf-v6-c-page__header {
  position: sticky;
  top: 0;
  z-index: var(--pf-t--global--z-index--lg);
  background-color: var(--pf-t--global--background--color--primary);
  border-bottom: var(--pf-t--global--border--width--box--default) solid var(--pf-t--global--border--color--default);
}

// ALTERNATIVE: Could be simplified to use PatternFly modifier classes:
// <PageSection className="pf-m-sticky-top">
//   {/* Header content */}
// </PageSection>
```

### 2. **Wizard Implementation**
```typescript
// Complex wizard with steps - CreateImageWizard.tsx
import {
  Wizard,
  WizardStep,
  WizardHeader,
  WizardToggle,
} from '@patternfly/react-core';
import { WizardStepType } from '@patternfly/react-core/dist/esm/components/Wizard';

// Multi-step wizard with custom validation and navigation
const CreateImageWizard = () => {
  // Implementation uses PatternFly Wizard with custom step management
  return (
    <Wizard
      navAriaLabel="Image creation steps"
      mainAriaLabel="Image creation content"
      steps={wizardSteps}
    />
  );
};
```

### 3. **Table Patterns**
```typescript
// Complex data tables with expansion - ImagesTable.tsx
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ExpandableRowContent,
  ActionsColumn,
} from '@patternfly/react-table';

// Pattern includes:
// - Expandable rows for detailed information
// - Actions columns with dropdown menus
// - Sorting and pagination
// - Custom row rendering for different data types
```

### 4. **Form Components**
```typescript
// Form patterns with validation - throughout wizard steps
import {
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';

// Consistent pattern for form validation:
const FormField = () => (
  <FormGroup
    label="Field Label"
    isRequired
    fieldId="field-id"
  >
    <TextInput
      isRequired
      type="text"
      id="field-id"
      validated={errors.field ? 'error' : 'default'}
      value={formData.field}
      onChange={handleChange}
    />
    <FormHelperText>
      <HelperText>
        <HelperTextItem variant={errors.field ? 'error' : 'default'}>
          {errors.field || 'Helper text'}
        </HelperTextItem>
      </HelperText>
    </FormHelperText>
  </FormGroup>
);
```

### 5. **Modal Usage (Deprecated - Needs Update)**
```typescript
// Current implementation using deprecated Modal
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';

// SHOULD BE MIGRATED TO:
import { Modal, ModalVariant } from '@patternfly/react-core';
```

### 6. **Toolbar and Pagination Patterns**
```typescript
// Consistent toolbar implementation
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';

const DataToolbar = () => (
  <Toolbar>
    <ToolbarContent>
      <ToolbarItem>
        <SearchInput />
      </ToolbarItem>
      <ToolbarItem alignment={{ default: 'alignRight' }}>
        <Pagination
          itemCount={totalItems}
          page={currentPage}
          perPage={perPage}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          variant={PaginationVariant.top}
        />
      </ToolbarItem>
    </ToolbarContent>
  </Toolbar>
);
```

### 7. **Alert and Status Components**
```typescript
// Status and alert patterns
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  Spinner,
  Badge,
} from '@patternfly/react-core';

// Error handling pattern:
const ErrorAlert = ({ error, onDismiss }) => (
  <Alert
    variant="danger"
    title="Error occurred"
    actionClose={<AlertActionCloseButton onClose={onDismiss} />}
    isInline
  >
    {error.message}
  </Alert>
);
```

### 8. **Sticky Positioning Patterns**
```typescript
// PatternFly provides multiple approaches for sticky positioning

// OPTION 1: CSS Modifier Classes (Recommended)
import { PageSection } from '@patternfly/react-core';

// Sticky to top (most common use case)
<PageSection className="pf-m-sticky-top">
  {/* Content sticks to top of viewport */}
</PageSection>

// Sticky to bottom
<PageSection className="pf-m-sticky-bottom">
  {/* Content sticks to bottom of viewport */}
</PageSection>

// Responsive sticky behavior
<PageSection className="pf-m-sticky-top-on-md">
  {/* Only sticky on medium screens and up */}
</PageSection>

<PageSection className="pf-m-sticky-top-on-lg-height">
  {/* Sticky on large height breakpoints */}
</PageSection>
```

```typescript
// OPTION 2: Components with Built-in Sticky Props
import { Banner, SidebarPanel, JumpLinks } from '@patternfly/react-core';

// Banner component with sticky behavior
<Banner isSticky>
  <div>This banner sticks to the top</div>
</Banner>

// Sidebar panel with sticky variant
<SidebarPanel variant="sticky">
  <div>Sticky sidebar content</div>
</SidebarPanel>

// JumpLinks for navigation (commonly used sticky)
<JumpLinks
  isVertical={false}
  isCentered={true}
  label="Jump to section"
  scrollableSelector=".pf-v6-c-page__main-container"
  offset={headerHeight}
>
  <JumpLinksItem href="#section1">Section 1</JumpLinksItem>
  <JumpLinksItem href="#section2">Section 2</JumpLinksItem>
</JumpLinks>
```

```scss
// OPTION 3: Custom CSS Implementation (when needed)
// Use PatternFly tokens for consistent z-index values
.custom-sticky-header {
  position: sticky;
  top: 0;
  z-index: var(--pf-t--global--z-index--lg); // PatternFly 6 token
  background-color: var(--pf-t--global--background--color--primary);
  border-bottom: var(--pf-t--global--border--width--box--default) solid var(--pf-t--global--border--color--default);
}

// Legacy PatternFly 5/6 variables (migrate to tokens above)
.legacy-sticky {
  z-index: var(--pf-v6-global--ZIndex--lg); // Update to --pf-t--global--z-index--lg
  background-color: var(--pf-v6-global--BackgroundColor--100); // Update to tokens
}
```

**❌ PageSection Limitations:**
- `PageSection` itself does NOT have sticky props like `isSticky` or `variant="sticky"`
- Must use CSS modifier classes or custom CSS for sticky behavior on PageSection

**✅ Available CSS Modifiers:**
- `.pf-m-sticky-top` - Stick to top of container
- `.pf-m-sticky-bottom` - Stick to bottom of container  
- `.pf-m-sticky-top-on-{breakpoint}` - Responsive sticky (sm, md, lg, xl, 2xl)
- `.pf-m-sticky-bottom-on-{breakpoint}` - Responsive sticky bottom
- `.pf-m-sticky-top-on-{breakpoint}-height` - Height-based breakpoints

**Common Use Cases:**
```typescript
// 1. Sticky page header
<PageSection className="pf-m-sticky-top">
  <ImageBuilderHeader />
</PageSection>

// 2. Sticky toolbar (responsive)
<PageSection className="pf-m-sticky-top-on-md">
  <Toolbar>{/* toolbar content */}</Toolbar>
</PageSection>

// 3. Sticky navigation tabs
<PageSection className="pf-m-sticky-top" style={{ zIndex: 'var(--pf-t--global--z-index--md)' }}>
  <Tabs>{/* navigation tabs */}</Tabs>
</PageSection>

// 4. Sticky footer actions
<PageSection className="pf-m-sticky-bottom">
  <ActionGroup>{/* footer buttons */}</ActionGroup>
</PageSection>
```

## 🔧 **Component Architecture Patterns**

### Custom Helper Components
```typescript
// Custom components wrapping PatternFly functionality
// src/Components/CreateImageWizard/steps/Packages/components/CustomHelperText.tsx
import {
  HelperText,
  HelperTextItem,
  FormHelperText,
} from '@patternfly/react-core';

export type HelperTextVariant = 'default' | 'indeterminate' | 'warning' | 'success' | 'error';

// Wrapper component for consistent helper text styling
```

### Popover Patterns
```typescript
// Information popovers with help icons
import { Button, Popover, Content } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

const InfoPopover = ({ title, children }) => (
  <Popover
    headerContent={title}
    bodyContent={<Content>{children}</Content>}
  >
    <Button
      icon={<HelpIcon />}
      variant="plain"
      aria-label={title}
      className="pf-v6-u-pl-sm pf-v6-u-pt-0 pf-v6-u-pb-0"
    />
  </Popover>
);
```

## 🚨 **Migration Requirements**

### 1. **Deprecated Modal Components**
**Priority: HIGH** - 9 files need updating

**Files requiring migration:**
- `ShareImageModal/ShareImageModal.tsx`
- `Blueprints/BlueprintDiffModal.tsx`
- `CreateImageWizard/steps/Packages/Packages.tsx`
- `CreateImageWizard/steps/Review/Footer/CreateDropdown.tsx`
- `CreateImageWizard/steps/Repositories/Repositories.tsx`
- `Blueprints/DeleteBlueprintModal.tsx`
- `Blueprints/ImportBlueprintModal.tsx`
- `CreateImageWizard/steps/Users/components/RemoveUserModal.tsx`
- `ImagesTable/Instance.tsx`

**Migration Pattern:**
```typescript
// FROM:
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';

// TO:
import { Modal, ModalVariant } from '@patternfly/react-core';
```

### 2. **CSS Variable Updates**
Some CSS variables may need updating for PatternFly 6 compatibility:

```scss
// Check if these need updates:
--pf6-global--spacer--md // Should be --pf-v6-global--spacer--md
--pf-c-form--GridGap     // May need PatternFly 6 equivalent
```

## 📋 **Code Quality Standards**

### Import Organization
```typescript
// Preferred order (as seen in codebase):
import React from 'react';

// PatternFly Core components (alphabetical)
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
} from '@patternfly/react-core';

// PatternFly specialized packages
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CodeEditor, Language } from '@patternfly/react-code-editor';

// PatternFly icons
import { ExternalLinkAltIcon, HelpIcon } from '@patternfly/react-icons';

// Other imports...
```

### Accessibility Implementation
```typescript
// Consistent accessibility patterns found in codebase:
<Table aria-label="Images table" variant="compact">
<Button 
  aria-label="Package description"
  icon={<HelpIcon />}
  variant="plain" 
/>
<Th screenReaderText="Actions" />
```

### TypeScript Integration
```typescript
// Type imports for PatternFly components
import { MenuToggleElement } from '@patternfly/react-core/dist/esm/components/MenuToggle/MenuToggle';
import { OnSetPage } from '@patternfly/react-core/dist/esm/components/Pagination/Pagination';

// Custom type definitions extending PatternFly types
export type HelperTextVariant = 'default' | 'indeterminate' | 'warning' | 'success' | 'error';
```

## 🛠️ **Development Guidelines**

### Utility Classes Usage
```typescript
// PatternFly utility classes used throughout codebase:
className="pf-v6-u-pl-sm pf-v6-u-pt-0 pf-v6-u-pb-0"   // Spacing utilities
className="pf-v6-u-min-width"                          // Size utilities  
className="pf-v6-u-max-width"                          // Size utilities
```

### Icon Usage Patterns
```typescript
// External link pattern (used consistently):
<Button
  component="a"
  target="_blank"
  variant="link"
  icon={<ExternalLinkAltIcon />}
  iconPosition="right"
  isInline
  href={url}
>
  Link Text
</Button>
```

## 📊 **Performance Considerations**

### Code Splitting
```typescript
// Code editor is conditionally imported in FirstBoot step
import { CodeEditor, Language } from '@patternfly/react-code-editor';

// Consider lazy loading for heavy components:
const CodeEditor = React.lazy(() => 
  import('@patternfly/react-code-editor').then(module => ({ 
    default: module.CodeEditor 
  }))
);
```

### Bundle Optimization
- All PatternFly imports use named imports (good for tree shaking)
- No wildcard imports found
- Deep imports only used when necessary for types

## 🔄 **Maintenance Tasks**

### Weekly
- [ ] Monitor for PatternFly updates
- [ ] Check deprecated component usage

### Monthly  
- [ ] Review custom CSS variable usage
- [ ] Validate accessibility patterns

### Before Major PatternFly Updates
- [ ] Test deprecated Modal migration plan
- [ ] Validate custom CSS variable compatibility
- [ ] Review breaking changes in PatternFly release notes
- [ ] Test wizard and table functionality thoroughly

### Component Audit Checklist
- [ ] No deprecated imports
- [ ] Proper accessibility attributes
- [ ] Consistent import patterns
- [ ] TypeScript coverage for PatternFly props
- [ ] Custom CSS follows PatternFly variable patterns

---

*This implementation guide reflects the current state of PatternFly usage in the Image Builder Frontend codebase as of PatternFly 6.1.0. Update this document when implementing changes or upgrades.* 