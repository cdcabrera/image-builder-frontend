# Image Builder Frontend - Maintenance Guidelines

## Overview
This document provides comprehensive maintenance guidelines for the Image Builder Frontend, a React TypeScript application built for Red Hat Cloud Services. The application uses modern React patterns, Redux Toolkit for state management, and PatternFly for UI components.

## Project Structure

### Core Architecture
```
src/
├── Components/          # Feature-based component organization
│   ├── Blueprints/     # Blueprint management components
│   ├── CreateImageWizard/ # Image creation wizard
│   ├── ImagesTable/    # Image listing and management
│   ├── LandingPage/    # Main landing page
│   └── sharedComponents/ # Reusable components
├── Hooks/              # Custom React hooks
├── store/              # Redux Toolkit state management
├── Utilities/          # Utility functions and custom hooks
└── test/               # Test utilities and mocks
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict Mode**: The project uses strict TypeScript settings
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `exactOptionalPropertyTypes: true`
- **Target**: ES2021 with modern JSX transform
- **Module System**: ESNext with Node resolution

### Formatting Standards (Prettier)
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Quotes**: 
  - Double quotes for JavaScript/JSX
  - Single quotes for TypeScript files
- **Bracket Spacing**: Enabled

### ESLint Rules
- **Import Order**: Enforced with specific grouping:
  1. React (always first)
  2. External libraries (alphabetical)
  3. Internal modules (alphabetical)
  4. Relative imports
- **Accessibility**: jsx-a11y rules enabled
- **React Hooks**: Rules enforced
- **TypeScript**: Strict linting with @typescript-eslint
- **No Console**: Console statements not allowed in production code

## Component Development Guidelines

### Component Structure
1. **Functional Components**: Use function declarations, not arrow functions for main components
2. **TypeScript**: All components must have proper TypeScript interfaces
3. **Props Interface**: Define clear prop types with descriptive names ending in `PropTypes`

```typescript
type ComponentNamePropTypes = {
  prop1: string;
  prop2?: number;
  onAction: (data: SomeType) => void;
};

const ComponentName = ({ prop1, prop2, onAction }: ComponentNamePropTypes) => {
  // Component implementation
};
```

### Hooks Usage
- **Custom Hooks**: Store in `src/Hooks/` directory with feature-based organization
- **State Management**: Use Redux Toolkit for global state, local state for component-specific data
- **Side Effects**: Proper cleanup in useEffect hooks
- **Dependencies**: Always include all dependencies in useEffect dependency arrays

### Component Organization
- **Feature-Based**: Group components by feature/domain
- **Shared Components**: Place reusable components in `sharedComponents/`
- **Single Responsibility**: Each component should have a clear, single purpose
- **Composition**: Prefer composition over inheritance

## State Management

### Redux Toolkit Patterns
- **Slices**: Use createSlice for state management
- **RTK Query**: Use for API calls and caching
- **Async Actions**: Use createAsyncThunk for complex async operations
- **Type Safety**: Ensure all actions and state are properly typed

### API Integration
- **Service Layer**: Organize API calls in `src/store/service/`
- **Error Handling**: Implement consistent error handling patterns
- **Loading States**: Manage loading states consistently across the application

## Testing Guidelines

### Testing Framework
- **Unit Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright for end-to-end testing
- **Coverage**: Maintain test coverage with vitest coverage

### Testing Patterns
- **Component Testing**: Test component behavior, not implementation
- **User Interactions**: Use user-event library for realistic user interactions
- **Mocking**: Use MSW (Mock Service Worker) for API mocking
- **Accessibility**: Include accessibility testing in component tests

### Test Organization
- **Co-location**: Place test files near the components they test
- **Test Utilities**: Use shared test utilities from `src/test/`
- **Mock Data**: Maintain consistent mock data patterns

## Dependencies Management

### Core Dependencies
- **React**: 18.3.1 (latest stable)
- **TypeScript**: 5.8.3
- **Redux Toolkit**: 2.8.2
- **PatternFly**: 6.1.0 (UI component library)
- **Red Hat Cloud Services**: Frontend components and utilities

### Dependency Updates
- **Regular Updates**: Use Renovate for automated dependency updates
- **Security**: Monitor for security vulnerabilities
- **Breaking Changes**: Test thoroughly when updating major versions
- **Lock File**: Always commit package-lock.json changes

## Build and Development

### Development Scripts
- `npm start`: Development server
- `npm run start:stage`: Development with stage environment
- `npm run start:msw:stage`: Development with MSW mocking
- `npm test`: Run unit tests
- `npm run test:coverage`: Run tests with coverage
- `npm run lint`: Run ESLint
- `npm run build`: Production build

### Build Configuration
- **Frontend Components Config**: Uses Red Hat Cloud Services build configuration
- **Webpack**: Custom configuration for Cockpit builds
- **Environment Variables**: Proper environment variable handling

## Git Workflow and Commit Guidelines

### Commit Message Format
Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `build:` Build system changes
- `deps:` Dependency updates
- `test:` Test additions/modifications
- `docs:` Documentation changes
- `refactor:` Code refactoring

### Branch Strategy
- **Main Branch**: `main` - production-ready code
- **Feature Branches**: Use descriptive names (e.g., `feature/component-name`)
- **Pull Requests**: Required for all changes to main branch

## Performance Guidelines

### Code Splitting
- **Lazy Loading**: Use React.lazy for route-based code splitting
- **Bundle Analysis**: Use webpack-bundle-analyzer to monitor bundle size
- **Tree Shaking**: Ensure proper tree shaking with ES modules

### React Performance
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Avoid Inline Objects**: Don't create objects/functions in render
- **Key Props**: Always provide stable keys for list items

## Accessibility Guidelines

### WCAG Compliance
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Readers**: Provide proper ARIA labels and descriptions
- **Color Contrast**: Maintain WCAG AA color contrast ratios
- **Focus Management**: Proper focus management in modals and wizards

### PatternFly Integration
- **Accessible Components**: Leverage PatternFly's built-in accessibility features
- **Custom Components**: Follow PatternFly accessibility patterns for custom components

## Security Guidelines

### Code Security
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize dynamic content
- **Dependencies**: Regular security audits of dependencies
- **Environment Variables**: Never commit sensitive data

### Authentication
- **Chrome Integration**: Use Red Hat Cloud Services Chrome for authentication
- **Token Management**: Proper JWT token handling
- **Permission Checks**: Implement proper authorization checks

## Maintenance Procedures

### Regular Maintenance Tasks
1. **Weekly**:
   - Review and merge dependency updates
   - Check test coverage reports
   - Review performance metrics

2. **Monthly**:
   - Update documentation
   - Review and clean up technical debt
   - Analyze bundle size and performance

3. **Quarterly**:
   - Major dependency updates
   - Architecture review
   - Security audit

### Monitoring and Debugging
- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: Monitor Core Web Vitals
- **User Analytics**: Track user interactions and feature usage

### Documentation Maintenance
- **Code Comments**: Keep inline documentation up to date
- **README**: Maintain accurate setup and development instructions
- **API Documentation**: Keep API integration documentation current

## Troubleshooting Common Issues

### Development Environment
- **Node Version**: Ensure Node.js >= 16.0.0
- **NPM Version**: Ensure npm >= 7.0.0
- **Clear Cache**: `npm ci` for clean installs

### Build Issues
- **TypeScript Errors**: Check tsconfig.json and type definitions
- **Import Errors**: Verify import paths and module resolution
- **Bundle Size**: Use webpack-bundle-analyzer to identify large dependencies

### Testing Issues
- **Test Environment**: Ensure proper test environment setup
- **Mock Issues**: Verify MSW handlers are properly configured
- **Async Testing**: Use proper async/await patterns in tests

## Code Review Guidelines

### Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components follow established patterns
- [ ] Tests are included and passing
- [ ] Accessibility considerations addressed
- [ ] Performance implications considered
- [ ] Documentation updated if needed

### Review Focus Areas
- **Code Quality**: Maintainable, readable code
- **Performance**: No unnecessary re-renders or large bundles
- **Security**: No security vulnerabilities introduced
- **Accessibility**: WCAG compliance maintained
- **Testing**: Adequate test coverage

## Migration and Upgrade Guidelines

### React Upgrades
- **Incremental Updates**: Update React incrementally
- **Breaking Changes**: Review React changelog for breaking changes
- **Testing**: Thorough testing after React updates

### PatternFly Updates
- **Component Changes**: Review PatternFly changelog for component changes
- **Design System**: Ensure consistency with PatternFly design system
- **Accessibility**: Verify accessibility features are maintained

### TypeScript Updates
- **Strict Mode**: Maintain strict TypeScript configuration
- **Type Definitions**: Update @types packages alongside TypeScript
- **Compilation**: Ensure clean compilation with new TypeScript versions

---

*Last Updated: [Current Date]*
*Version: 1.0*

This document should be reviewed and updated regularly to reflect changes in the codebase, tooling, and best practices.
