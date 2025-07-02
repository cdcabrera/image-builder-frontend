# Image Builder Frontend - Maintenance Documentation

This directory contains comprehensive maintenance guidelines and documentation for the Image Builder Frontend project. These documents provide essential information for developers, maintainers, and contributors to ensure consistent code quality, development practices, and project health.

## 📚 Documentation Overview

### 🏗️ [Maintenance Guidelines](./maintenance-guidelines.md)
**Primary maintenance document covering all aspects of the project**

- Project structure and architecture overview
- Code style guidelines and TypeScript configuration
- Component development patterns
- State management with Redux Toolkit
- Testing strategies and frameworks
- Dependencies management
- Build and deployment processes
- Git workflow and commit conventions
- Performance optimization guidelines
- Accessibility requirements
- Security best practices
- Regular maintenance procedures
- Troubleshooting common issues
- Code review guidelines
- Migration and upgrade procedures

### 💻 [Code Style Examples](./code-style-examples.md)
**Concrete examples of coding patterns and styles used in the project**

- React component examples (functional components, hooks)
- Redux Toolkit patterns (slices, RTK Query)
- Custom hook implementations
- Testing examples (component tests, hook tests)
- Utility function patterns
- Import/export conventions
- Error handling patterns
- TypeScript type definitions
- Performance optimization examples

### 🔄 [Development Workflow](./development-workflow.md)
**Complete guide to the development process and best practices**

- Getting started and environment setup
- Available npm scripts and their usage
- Git workflow and branching strategy
- Commit message conventions
- Pull request process
- Testing strategy and execution
- Code quality tools (ESLint, Prettier)
- Debugging techniques and tools
- Performance monitoring
- Deployment procedures
- Troubleshooting common development issues
- Maintenance task schedules

### 🏛️ [Component Patterns & Architecture](./component-patterns.md)
**Architectural decisions and component design patterns**

- High-level application architecture
- Core design principles
- Component patterns:
  - Container/Presentational pattern
  - Compound component pattern
  - Render props pattern
  - Higher-Order Component (HOC) pattern
  - Custom hook pattern
- State management patterns
- Error handling strategies
- Performance optimization patterns
- Testing patterns
- Accessibility patterns

### 🎨 [PatternFly Development Guidelines](./patternfly-guidelines.md)
**PatternFly-specific development practices and AI-assisted development**

- PatternFly 6.x component usage standards
- Import patterns and component composition
- Form and wizard implementation patterns
- Table and data display best practices
- Design system integration (colors, spacing, theming)
- Accessibility requirements and testing
- Performance optimization for PatternFly components
- AI-assisted development setup (context7 MCP, Cursor rules)
- External PatternFly AI resources integration
- Migration and maintenance guidelines

### 🔧 [PatternFly Implementation Guide](./patternfly-implementation.md)
**Current PatternFly implementation in the Image Builder Frontend codebase**

- Current PatternFly 6.1.0 dependencies and setup
- Actual import patterns and component usage in codebase
- Custom styling and CSS variable implementations
- Component architecture patterns (wizards, tables, forms, modals)
- Deprecated component usage and migration requirements
- Code quality standards and TypeScript integration
- Performance considerations and bundle optimization
- Maintenance tasks and component audit checklist

## 🚀 Quick Start

### For New Developers
1. Start with [Development Workflow](./development-workflow.md) for environment setup
2. Review [Code Style Examples](./code-style-examples.md) to understand coding patterns
3. Study [Component Patterns](./component-patterns.md) for architectural understanding
4. Learn [PatternFly Guidelines](./patternfly-guidelines.md) for UI component best practices
5. Review [PatternFly Implementation](./patternfly-implementation.md) for current codebase patterns
6. Reference [Maintenance Guidelines](./maintenance-guidelines.md) for comprehensive project knowledge

### For Maintainers
1. Follow [Maintenance Guidelines](./maintenance-guidelines.md) for regular maintenance tasks
2. Use [Development Workflow](./development-workflow.md) for code review processes
3. Reference [Component Patterns](./component-patterns.md) for architectural decisions
4. Monitor [PatternFly Implementation](./patternfly-implementation.md) for migration requirements
5. Update documentation as the project evolves

### For Contributors
1. Read [Development Workflow](./development-workflow.md) for contribution process
2. Follow [Code Style Examples](./code-style-examples.md) for consistent coding
3. Understand [Component Patterns](./component-patterns.md) for proper implementation
4. Apply [PatternFly Guidelines](./patternfly-guidelines.md) for UI consistency
5. Check [PatternFly Implementation](./patternfly-implementation.md) for current usage patterns
6. Adhere to [Maintenance Guidelines](./maintenance-guidelines.md) for quality standards

## 🛠️ Technology Stack

### Core Technologies
- **React 18.3.1**: Modern React with hooks and concurrent features
- **TypeScript 5.8.3**: Strict type checking and modern JavaScript features
- **Redux Toolkit 2.8.2**: State management with RTK Query for API calls
- **PatternFly 6.1.0**: Red Hat's design system and UI components

### Development Tools
- **Vitest**: Unit testing framework with React Testing Library
- **Playwright**: End-to-end testing
- **ESLint**: Code linting with Red Hat Cloud Services configuration
- **Prettier**: Code formatting
- **MSW (Mock Service Worker)**: API mocking for development and testing

### Build & Deployment
- **Frontend Components Config**: Red Hat Cloud Services build configuration
- **Webpack**: Module bundling with custom configurations
- **SCSS**: Styling with Sass preprocessing
- **Babel**: JavaScript transpilation

## 📋 Key Principles

### Code Quality
- **Type Safety**: Comprehensive TypeScript coverage with strict settings
- **Testing**: High test coverage with unit, integration, and E2E tests
- **Linting**: Strict ESLint rules for code quality and consistency
- **Accessibility**: WCAG compliance built into all components

### Development Practices
- **Feature-Based Organization**: Components organized by business domain
- **Conventional Commits**: Standardized commit message format
- **Code Reviews**: Mandatory reviews for all changes
- **Continuous Integration**: Automated testing and quality checks

### Architecture
- **Component Composition**: Prefer composition over inheritance
- **Single Responsibility**: Each component has one clear purpose
- **Separation of Concerns**: UI, business logic, and data management separated
- **Performance**: Optimized for Core Web Vitals and user experience

## 🔄 Maintenance Schedule

### Weekly Tasks
- Review and merge dependency updates
- Check test coverage reports
- Monitor performance metrics
- Review open pull requests

### Monthly Tasks
- Update documentation
- Clean up technical debt
- Analyze bundle size trends
- Review and update dependencies

### Quarterly Tasks
- Major dependency updates
- Architecture review
- Security audit
- Performance optimization review

## 📞 Getting Help

### Internal Resources
- Team documentation and knowledge base
- Code review feedback and discussions
- Architecture decision records

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PatternFly Documentation](https://www.patternfly.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Red Hat Cloud Services Frontend Components](https://github.com/RedHatInsights/frontend-components)

## 📝 Contributing to Documentation

This documentation should be kept up-to-date as the project evolves. When making significant changes to the codebase:

1. **Update relevant documentation** to reflect changes
2. **Add new patterns** to the appropriate guide
3. **Update examples** to match current implementation
4. **Review and revise** guidelines as needed

### Documentation Standards
- Use clear, concise language
- Provide concrete examples
- Include code snippets where helpful
- Maintain consistent formatting
- Update table of contents when adding sections

## 🏷️ Version Information

- **Documentation Version**: 1.0
- **Last Updated**: Current Date
- **Project Version**: 1.1.0
- **Node.js Requirement**: >= 16.0.0
- **npm Requirement**: >= 7.0.0

---

*This documentation is maintained by the Image Builder Frontend team. For questions or suggestions, please reach out to the development team or create an issue in the project repository.*
