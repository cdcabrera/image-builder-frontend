# PatternFly Development Guidelines

This document provides specific guidelines for PatternFly development in the Image Builder Frontend project, incorporating AI-assisted development best practices.

## 📚 External PatternFly AI Resources

### Primary Reference: PatternFly AI Coding Support
**Repository**: [nicolethoen/patternfly-ai-coding](https://github.com/nicolethoen/patternfly-ai-coding)

This external repository provides comprehensive, AI-friendly knowledge base and starting point for prototyping PatternFly applications. It includes:

- **AI-Optimized Documentation**: Indexed documentation specifically designed for AI coding tools
- **Cursor Rules**: Pre-configured `.cursor/rules/` for PatternFly best practices
- **Component Guidelines**: Latest PatternFly React component patterns
- **context7 MCP Setup**: Integration for always-up-to-date PatternFly documentation

> **Important**: For maximum AI assistance effectiveness, consider cloning or copying the `documentation/` directory and `.cursor/rules/` files from this repository into your local workspace.

## 🎯 PatternFly 6.x Guidelines for Image Builder

### Version Information
- **Current PatternFly Version**: 6.1.0
- **React Support**: React 18.3.1+
- **TypeScript**: Full TypeScript support with strict typing

### Component Usage Standards

#### 1. Import Patterns
```typescript
// Preferred: Named imports from specific modules
import { Button, Card, CardBody } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

// For icons
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

// Avoid: Default or wildcard imports
// import * as PF from '@patternfly/react-core'; // ❌ Don't do this
```

#### 2. Component Composition Patterns
```typescript
// Example: Proper Card composition for Image Builder
import { Card, CardTitle, CardBody, CardFooter } from '@patternfly/react-core';

const ImageCard = ({ image, onEdit, onDelete }: ImageCardProps) => (
  <Card isSelectableRaised>
    <CardTitle>{image.name}</CardTitle>
    <CardBody>
      <ImageDetails image={image} />
    </CardBody>
    <CardFooter>
      <ImageActions onEdit={onEdit} onDelete={onDelete} />
    </CardFooter>
  </Card>
);
```

#### 3. Form Patterns for Wizards
```typescript
// Use PatternFly form components with proper validation
import { 
  Form, 
  FormGroup, 
  TextInput, 
  FormHelperText,
  HelperText,
  HelperTextItem 
} from '@patternfly/react-core';

const ImageDetailsForm = () => (
  <Form>
    <FormGroup
      label="Image name"
      isRequired
      fieldId="image-name"
    >
      <TextInput
        isRequired
        type="text"
        id="image-name"
        name="imageName"
        aria-describedby="image-name-helper"
        value={formData.name}
        onChange={handleNameChange}
        validated={errors.name ? 'error' : 'default'}
      />
      <FormHelperText>
        <HelperText>
          <HelperTextItem variant={errors.name ? 'error' : 'default'}>
            {errors.name || 'Enter a unique name for your image'}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  </Form>
);
```

### 4. Table Implementation Standards
```typescript
// Use PatternFly React Table with proper accessibility
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

const ImagesTable = ({ images }: ImagesTableProps) => (
  <Table 
    aria-label="Images table"
    variant="compact"
  >
    <Thead>
      <Tr>
        <Th sort={{ sortBy, onSort, columnIndex: 0 }}>Name</Th>
        <Th>Status</Th>
        <Th>Created</Th>
        <Th screenReaderText="Actions" />
      </Tr>
    </Thead>
    <Tbody>
      {images.map((image, rowIndex) => (
        <Tr key={image.id}>
          <Td dataLabel="Name">{image.name}</Td>
          <Td dataLabel="Status">
            <ImageStatusBadge status={image.status} />
          </Td>
          <Td dataLabel="Created">{formatDate(image.createdAt)}</Td>
          <Td isActionCell>
            <ImageRowActions image={image} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
```

## 🎨 Design System Integration

### Color and Theming
```scss
// Use PatternFly CSS variables for consistent theming
.custom-component {
  background-color: var(--pf-v6-global--BackgroundColor--100);
  border: var(--pf-v6-global--BorderWidth--sm) solid var(--pf-v6-global--BorderColor--100);
  padding: var(--pf-v6-global--spacer--md);
}

// Use semantic color tokens
.status-success {
  color: var(--pf-v6-global--success-color--100);
}

.status-danger {
  color: var(--pf-v6-global--danger-color--100);
}
```

### Spacing and Layout
```typescript
// Use PatternFly spacing utilities
import { 
  Grid, 
  GridItem, 
  Stack, 
  StackItem,
  Flex,
  FlexItem 
} from '@patternfly/react-core';

// Prefer semantic layout components over custom CSS
const ImageBuilderLayout = () => (
  <Grid hasGutter>
    <GridItem span={8}>
      <Stack hasGutter>
        <StackItem>
          <ImagesList />
        </StackItem>
        <StackItem>
          <ImagesPagination />
        </StackItem>
      </Stack>
    </GridItem>
    <GridItem span={4}>
      <ImagesSidebar />
    </GridItem>
  </Grid>
);
```

## 🔧 Development Best Practices

### 1. Accessibility Requirements
- **ARIA Labels**: Always provide descriptive `aria-label` or `aria-labelledby`
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Reader Support**: Use `screenReaderText` props where applicable
- **Focus Management**: Proper focus trapping in modals and wizards

### 2. Performance Optimization
```typescript
// Lazy load heavy PatternFly components
const DataList = React.lazy(() => import('@patternfly/react-core').then(module => ({ default: module.DataList })));

// Use React.memo for frequently re-rendered PatternFly components
const MemoizedImageCard = React.memo(ImageCard);

// Optimize table rendering for large datasets
const virtualized = images.length > 100;
```

### 3. Error Handling Patterns
```typescript
// Use PatternFly alert components for consistent error display
import { Alert, AlertVariant } from '@patternfly/react-core';

const ErrorAlert = ({ error, onDismiss }: ErrorAlertProps) => (
  <Alert
    variant={AlertVariant.danger}
    title="Error loading images"
    actionClose={<AlertActionCloseButton onClose={onDismiss} />}
    isInline
  >
    {error.message}
  </Alert>
);
```

## 🧪 Testing PatternFly Components

### Testing Guidelines
```typescript
// Test PatternFly component integration, not implementation
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageCard } from './ImageCard';

describe('ImageCard', () => {
  it('should display image information correctly', () => {
    const mockImage = { name: 'Test Image', status: 'ready' };
    render(<ImageCard image={mockImage} />);
    
    expect(screen.getByText('Test Image')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const mockOnEdit = jest.fn();
    render(<ImageCard image={mockImage} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockImage);
  });
});
```

### Accessibility Testing
```typescript
// Include accessibility testing in component tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<ImageCard image={mockImage} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🚀 AI-Assisted Development Setup

### Context7 MCP Setup (Optional)
For always up-to-date PatternFly documentation in AI coding tools:

1. **Install context7 MCP server**:
   ```json
   // ~/.cursor/mcp.json
   {
     "mcpServers": {
       "context7": {
         "command": "npx",
         "args": ["-y", "@upstash/context7-mcp@latest"]
       }
     }
   }
   ```

2. **Query PatternFly docs**: Use context7 to fetch latest PatternFly React documentation
3. **Stay Updated**: Automatically get the latest component APIs and patterns

### Cursor Rules Integration
Consider integrating [PatternFly Cursor rules](https://github.com/nicolethoen/patternfly-ai-coding/tree/main/.cursor/rules) for enhanced AI assistance:

- `.cursor/rules/patternfly-react.md`: React-specific PatternFly guidelines
- `.cursor/rules/patternfly-accessibility.md`: Accessibility-focused rules
- `.cursor/rules/patternfly-testing.md`: Testing best practices

## 📚 Reference Resources

### Official Documentation
- [PatternFly.org](https://www.patternfly.org/) - Main documentation
- [PatternFly React](https://github.com/patternfly/patternfly-react) - GitHub repository
- [PatternFly Design Kit](https://www.figma.com/community/file/1020607419932597426) - Figma design system

### AI-Friendly Resources
- [PatternFly AI Coding Support](https://github.com/nicolethoen/patternfly-ai-coding) - AI-optimized guidelines
- [PatternFly React Component Groups](https://github.com/nicolethoen/patternfly-ai-coding/blob/main/patternfly-react-component-groups.txt) - Component reference

### Image Builder Specific
- Review existing components in `src/Components/` for established patterns
- Follow wizard patterns in `CreateImageWizard/` for multi-step form workflows
- Use table patterns from `ImagesTable/` for data display consistency

## 🔄 Maintenance and Updates

### Regular Tasks
- **Weekly**: Check for PatternFly updates and security patches
- **Monthly**: Review component usage against latest PatternFly patterns
- **Quarterly**: Update AI-assistant rules and documentation

### Migration Guidelines
When updating PatternFly versions:
1. Review [PatternFly release notes](https://github.com/patternfly/patternfly-react/releases)
2. Test critical user workflows after updates
3. Update component patterns documentation
4. Verify accessibility compliance

---

*This document should be used in conjunction with the [external PatternFly AI resources](https://github.com/nicolethoen/patternfly-ai-coding) for comprehensive PatternFly development guidance.* 