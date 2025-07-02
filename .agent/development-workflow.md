# Development Workflow Guide

This document outlines the development workflow, processes, and best practices for contributing to the Image Builder Frontend project.

## Getting Started

### Prerequisites
- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0
- **Git**: Latest version
- **Red Hat Cloud Services Account**: For testing integration features

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd image-builder-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm ci
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Verify setup**:
   ```bash
   npm run lint
   npm test
   npm start
   ```

## Development Environment

### Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `npm start` | Development server | Local development |
| `npm run start:stage` | Development with stage environment | Testing with stage APIs |
| `npm run start:msw:stage` | Development with MSW mocking | API mocking for development |
| `npm test` | Run unit tests | Testing during development |
| `npm run test:watch` | Run tests in watch mode | Continuous testing |
| `npm run test:coverage` | Run tests with coverage | Coverage analysis |
| `npm run lint` | Run ESLint | Code quality check |
| `npm run lint:js:fix` | Fix ESLint issues | Automated code fixes |
| `npm run build` | Production build | Build verification |

### Development Server

The development server runs on `https://localhost:8002` by default and includes:
- Hot module replacement
- TypeScript compilation
- SCSS compilation
- ESLint integration
- Chrome DevTools integration

### Environment Configuration

#### Local Development
```bash
npm start
```
- Uses local mock data
- No authentication required
- Full feature access

#### Stage Environment
```bash
npm run start:stage
```
- Connects to stage APIs
- Requires authentication
- Real data from stage environment

#### MSW (Mock Service Worker)
```bash
npm run start:msw:stage
```
- Uses MSW for API mocking
- Simulates real API responses
- Ideal for feature development

## Git Workflow

### Branch Strategy

1. **Main Branch**: `main`
   - Production-ready code
   - Protected branch
   - Requires pull request reviews

2. **Feature Branches**: `feature/description` or `feature/ticket-number`
   - New features
   - Bug fixes
   - Improvements

3. **Hotfix Branches**: `hotfix/description`
   - Critical production fixes
   - Merged directly to main after review

### Commit Guidelines

#### Commit Message Format
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `chore`: Maintenance tasks

#### Examples
```bash
feat(wizard): add support for RHEL 9.5
fix(images-table): resolve pagination issue
docs: update API documentation
test(components): add tests for ImageCard component
build(deps): bump @patternfly/react-core to 6.1.0
```

### Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Changes**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**:
   - Use descriptive title
   - Include detailed description
   - Reference related issues
   - Add screenshots for UI changes

7. **Code Review**:
   - Address reviewer feedback
   - Update tests if needed
   - Ensure CI passes

8. **Merge**:
   - Squash and merge preferred
   - Delete feature branch after merge

## Testing Strategy

### Test Types

#### Unit Tests
- **Framework**: Vitest + React Testing Library
- **Location**: Co-located with components
- **Coverage**: Aim for >80% coverage
- **Focus**: Component behavior, hooks, utilities

#### Integration Tests
- **Framework**: Vitest + MSW
- **Location**: `src/test/integration/`
- **Focus**: Component interactions, API integration

#### End-to-End Tests
- **Framework**: Playwright
- **Location**: `playwright/`
- **Focus**: User workflows, critical paths

### Testing Best Practices

#### Component Testing
```typescript
// Good: Test behavior, not implementation
it('should display error message when form is invalid', () => {
  render(<MyForm />);
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/required field/i)).toBeInTheDocument();
});

// Avoid: Testing implementation details
it('should call setState when button is clicked', () => {
  // Don't test internal state changes
});
```

#### Mock Strategy
- Use MSW for API mocking
- Mock external dependencies
- Avoid mocking internal modules
- Keep mocks simple and focused

#### Test Organization
```
src/
├── Components/
│   ├── MyComponent/
│   │   ├── MyComponent.tsx
│   │   ├── MyComponent.test.tsx
│   │   └── __mocks__/
│   └── ...
└── test/
    ├── utils/
    ├── mocks/
    └── integration/
```

### Running Tests

#### Development
```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test MyComponent.test.tsx

# Run tests with coverage
npm run test:coverage
```

#### CI/CD
```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e
```

## Code Quality

### Linting and Formatting

#### ESLint Configuration
- Extends Red Hat Cloud Services config
- TypeScript support
- React hooks rules
- Accessibility rules
- Import ordering

#### Prettier Configuration
- 2-space indentation
- Semicolons required
- Double quotes for JS/JSX
- Single quotes for TypeScript

#### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"
```

### Code Review Checklist

#### Functionality
- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Error states managed
- [ ] Loading states implemented

#### Code Quality
- [ ] TypeScript types defined
- [ ] ESLint rules followed
- [ ] No console.log statements
- [ ] Proper error handling

#### Testing
- [ ] Unit tests added/updated
- [ ] Tests pass locally
- [ ] Coverage maintained
- [ ] E2E tests for critical paths

#### Performance
- [ ] No unnecessary re-renders
- [ ] Proper memoization used
- [ ] Bundle size impact considered
- [ ] Accessibility maintained

#### Documentation
- [ ] Code comments added
- [ ] README updated if needed
- [ ] API documentation current
- [ ] Breaking changes documented

## Debugging

### Development Tools

#### Browser DevTools
- React Developer Tools
- Redux DevTools
- Chrome DevTools
- Accessibility Inspector

#### VS Code Extensions
- ESLint
- Prettier
- TypeScript Hero
- GitLens
- Thunder Client (API testing)

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm ci

# Check TypeScript configuration
npx tsc --noEmit
```

#### Build Issues
```bash
# Clear build cache
rm -rf dist/
npm run build

# Analyze bundle
npm run build && npx webpack-bundle-analyzer dist/
```

#### Test Issues
```bash
# Clear test cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

## Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer dist/

# Check for circular dependencies
npm run circular
```

### Performance Monitoring
- Core Web Vitals
- Bundle size tracking
- Runtime performance
- Memory usage

### Optimization Techniques
- Code splitting with React.lazy
- Memoization with React.memo
- Proper dependency arrays
- Tree shaking optimization

## Deployment

### Build Process
```bash
# Production build
npm run build

# Verify build
npm run start:federated
```

### Environment Variables
- Development: `.env`
- Stage: Configured in CI/CD
- Production: Configured in deployment

### CI/CD Pipeline
1. **Lint**: ESLint checks
2. **Test**: Unit and integration tests
3. **Build**: Production build
4. **E2E**: Playwright tests
5. **Deploy**: Automated deployment

## Troubleshooting

### Common Development Issues

#### Port Already in Use
```bash
# Kill process on port 8002
lsof -ti:8002 | xargs kill -9

# Or use different port
PORT=8003 npm start
```

#### Module Resolution Issues
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm ci
```

#### Authentication Issues
```bash
# Clear browser storage
# Or use incognito mode
# Check environment configuration
```

### Getting Help

#### Internal Resources
- Team documentation
- Code review feedback
- Architecture decisions

#### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PatternFly Documentation](https://www.patternfly.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## Maintenance Tasks

### Weekly
- [ ] Review and merge dependency updates
- [ ] Check test coverage reports
- [ ] Monitor performance metrics
- [ ] Review open pull requests

### Monthly
- [ ] Update documentation
- [ ] Clean up technical debt
- [ ] Analyze bundle size trends
- [ ] Review and update dependencies

### Quarterly
- [ ] Major dependency updates
- [ ] Architecture review
- [ ] Security audit
- [ ] Performance optimization review

---

This workflow guide should be followed by all contributors to maintain code quality, consistency, and project health. Regular updates to this document ensure it remains current with project evolution.
