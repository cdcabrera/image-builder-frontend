# Component Patterns and Architecture Guide

This document outlines the component patterns, architectural decisions, and design principles used in the Image Builder Frontend project.

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Application                     │
├─────────────────────────────────────────────────────────────┤
│  React Components (PatternFly UI)                          │
│  ├── Feature Components (Wizards, Tables, Forms)          │
│  ├── Shared Components (Buttons, Modals, Cards)           │
│  └── Layout Components (Navigation, Headers)              │
├─────────────────────────────────────────────────────────────┤
│  State Management (Redux Toolkit)                          │
│  ├── Feature Slices (Wizard, Blueprint, Images)           │
│  ├── API Slices (RTK Query)                               │
│  └── Global State (User, Notifications)                   │
├─────────────────────────────────────────────────────────────┤
│  Services & Utilities                                      │
│  ├── API Services (REST, GraphQL)                         │
│  ├── Custom Hooks (Data fetching, UI state)               │
│  └── Utility Functions (Formatting, Validation)           │
├─────────────────────────────────────────────────────────────┤
│  Red Hat Cloud Services Platform                           │
│  ├── Chrome (Navigation, Auth, Analytics)                 │
│  ├── Frontend Components (Notifications, Utils)           │
│  └── Insights APIs (User, Entitlements)                   │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Feature-Based Organization**: Components organized by business domain
2. **Composition over Inheritance**: Prefer component composition
3. **Single Responsibility**: Each component has one clear purpose
4. **Separation of Concerns**: UI, business logic, and data management separated
5. **Accessibility First**: WCAG compliance built into all components
6. **Type Safety**: Comprehensive TypeScript coverage

## Component Patterns

### 1. Container/Presentational Pattern

#### Container Component (Smart Component)
Handles data fetching, state management, and business logic.

```typescript
// ImagesTableContainer.tsx
import React from 'react';

import { useGetImagesQuery } from '../../store/imageApi';
import { useAppSelector } from '../../store/hooks';

import ImagesTable from './ImagesTable';

const ImagesTableContainer = () => {
  const { data: images, isLoading, error } = useGetImagesQuery();
  const filters = useAppSelector((state) => state.images.filters);
  
  const filteredImages = React.useMemo(() => {
    if (!images) return [];
    return images.filter(image => 
      filters.status === 'all' || image.status === filters.status
    );
  }, [images, filters]);

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <ImagesTable 
      images={filteredImages}
      isLoading={isLoading}
      onRefresh={() => refetch()}
    />
  );
};

export default ImagesTableContainer;
```

#### Presentational Component (Dumb Component)
Focuses purely on rendering UI based on props.

```typescript
// ImagesTable.tsx
import React from 'react';

import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

import { Image } from '../../types';

type ImagesTablePropTypes = {
  images: Image[];
  isLoading: boolean;
  onRefresh: () => void;
};

const ImagesTable = ({ images, isLoading, onRefresh }: ImagesTablePropTypes) => {
  return (
    <Table aria-label="Images table">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Created</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {images.map((image) => (
          <ImageRow key={image.id} image={image} />
        ))}
      </Tbody>
    </Table>
  );
};

export default ImagesTable;
```

### 2. Compound Component Pattern

Used for complex components with multiple related parts.

```typescript
// Wizard compound component
import React, { createContext, useContext } from 'react';

import { Wizard as PFWizard } from '@patternfly/react-core';

// Context for sharing state between wizard parts
const WizardContext = createContext<{
  currentStep: number;
  formData: Record<string, unknown>;
  updateFormData: (data: Record<string, unknown>) => void;
} | null>(null);

// Main wizard component
const Wizard = ({ children, onSubmit }: WizardPropTypes) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const updateFormData = (data: Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <WizardContext.Provider value={{ currentStep, formData, updateFormData }}>
      <PFWizard>
        {children}
      </PFWizard>
    </WizardContext.Provider>
  );
};

// Step component
const WizardStep = ({ children, name }: WizardStepPropTypes) => {
  const context = useContext(WizardContext);
  
  return (
    <div data-step={name}>
      {children}
    </div>
  );
};

// Usage
<Wizard onSubmit={handleSubmit}>
  <WizardStep name="details">
    <DetailsForm />
  </WizardStep>
  <WizardStep name="review">
    <ReviewStep />
  </WizardStep>
</Wizard>
```

### 3. Render Props Pattern

For sharing logic between components.

```typescript
// DataProvider with render props
type DataProviderPropTypes<T> = {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
};

const DataProvider = <T,>({ url, children }: DataProviderPropTypes<T>) => {
  const { data, loading, error, refetch } = useApi<T>(url);
  
  return <>{children({ data, loading, error, refetch })}</>;
};

// Usage
<DataProvider<Image[]> url="/api/images">
  {({ data, loading, error, refetch }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorAlert error={error} />;
    return <ImagesList images={data || []} onRefresh={refetch} />;
  }}
</DataProvider>
```

### 4. Higher-Order Component (HOC) Pattern

For cross-cutting concerns like authentication.

```typescript
// withAuthentication HOC
const withAuthentication = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent = (props: P) => {
    const { auth } = useChrome();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await auth?.getUser();
          setIsAuthenticated(!!user);
        } catch (error) {
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [auth]);

    if (loading) {
      return <Spinner />;
    }

    if (!isAuthenticated) {
      return <LoginRequired />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuthentication(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
};

// Usage
export default withAuthentication(MyProtectedComponent);
```

### 5. Custom Hook Pattern

For reusable stateful logic.

```typescript
// useFormValidation hook
type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | null;
};

const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: T[keyof T]) => {
    const rule = validationRules[name];
    return rule ? rule(value) : null;
  };

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isValid = Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
  };
};

// Usage in component
const MyForm = () => {
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
  } = useFormValidation(
    { name: '', email: '' },
    {
      name: (value) => !value ? 'Name is required' : null,
      email: (value) => !value?.includes('@') ? 'Invalid email' : null,
    }
  );

  return (
    <form>
      <input
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />
      {touched.name && errors.name && <span>{errors.name}</span>}
    </form>
  );
};
```

## State Management Patterns

### 1. Redux Toolkit Slice Pattern

```typescript
// Feature slice with async actions
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for API calls
export const createImage = createAsyncThunk(
  'images/create',
  async (imageData: CreateImageRequest, { rejectWithValue }) => {
    try {
      const response = await imageApi.createImage(imageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const imagesSlice = createSlice({
  name: 'images',
  initialState: {
    items: [],
    filters: { status: 'all', search: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createImage.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError } = imagesSlice.actions;
export default imagesSlice.reducer;
```

### 2. RTK Query Pattern

```typescript
// API slice with RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/images',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Image', 'Blueprint'],
  endpoints: (builder) => ({
    getImages: builder.query<Image[], ImageFilters>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Image' as const, id })),
              { type: 'Image', id: 'LIST' },
            ]
          : [{ type: 'Image', id: 'LIST' }],
    }),
    createImage: builder.mutation<Image, CreateImageRequest>({
      query: (newImage) => ({
        url: '',
        method: 'POST',
        body: newImage,
      }),
      invalidatesTags: [{ type: 'Image', id: 'LIST' }],
    }),
  }),
});

export const { useGetImagesQuery, useCreateImageMutation } = imageApi;
```

## Error Handling Patterns

### 1. Error Boundary Pattern

```typescript
// Global error boundary
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Global error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState>
          <EmptyStateIcon icon={ExclamationTriangleIcon} />
          <Title headingLevel="h4" size="lg">
            Something went wrong
          </Title>
          <EmptyStateBody>
            An unexpected error occurred. Please refresh the page or contact support.
          </EmptyStateBody>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </EmptyState>
      );
    }

    return this.props.children;
  }
}
```

### 2. Async Error Handling Pattern

```typescript
// useAsyncError hook for handling async errors
const useAsyncError = () => {
  const [, setError] = useState();
  
  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};

// Usage in async operations
const MyComponent = () => {
  const throwError = useAsyncError();
  
  const handleAsyncOperation = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      throwError(error); // This will be caught by error boundary
    }
  };

  return <button onClick={handleAsyncOperation}>Do Something</button>;
};
```

## Performance Patterns

### 1. Memoization Pattern

```typescript
// Component memoization
const ExpensiveComponent = React.memo<ExpensiveComponentPropTypes>(
  ({ data, onAction }) => {
    const processedData = useMemo(() => {
      return data.map(item => ({
        ...item,
        computed: expensiveComputation(item),
      }));
    }, [data]);

    const handleAction = useCallback((id: string) => {
      onAction(id);
    }, [onAction]);

    return (
      <div>
        {processedData.map(item => (
          <Item 
            key={item.id} 
            data={item} 
            onAction={handleAction} 
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return (
      prevProps.data.length === nextProps.data.length &&
      prevProps.onAction === nextProps.onAction
    );
  }
);
```

### 2. Code Splitting Pattern

```typescript
// Route-based code splitting
const LazyImagesPage = React.lazy(() => import('./pages/ImagesPage'));
const LazyBlueprintsPage = React.lazy(() => import('./pages/BlueprintsPage'));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/images" element={<LazyImagesPage />} />
        <Route path="/blueprints" element={<LazyBlueprintsPage />} />
      </Routes>
    </Suspense>
  </Router>
);

// Component-based code splitting
const LazyModal = React.lazy(() => import('./components/HeavyModal'));

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Open Modal</Button>
      {showModal && (
        <Suspense fallback={<Spinner />}>
          <LazyModal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </>
  );
};
```

## Testing Patterns

### 1. Component Testing Pattern

```typescript
// Test utilities for consistent testing
const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </BrowserRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Component test example
describe('ImagesTable', () => {
  const mockImages = [
    { id: '1', name: 'Test Image', status: 'ready' },
    { id: '2', name: 'Another Image', status: 'building' },
  ];

  it('renders images correctly', () => {
    renderWithProviders(
      <ImagesTable images={mockImages} isLoading={false} onRefresh={vi.fn()} />
    );

    expect(screen.getByText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Another Image')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProviders(
      <ImagesTable images={[]} isLoading={true} onRefresh={vi.fn()} />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### 2. Hook Testing Pattern

```typescript
// Custom hook testing
describe('useFormValidation', () => {
  const validationRules = {
    email: (value: string) => !value.includes('@') ? 'Invalid email' : null,
  };

  it('validates fields correctly', () => {
    const { result } = renderHook(() =>
      useFormValidation({ email: '' }, validationRules)
    );

    act(() => {
      result.current.handleChange('email', 'invalid-email');
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.handleChange('email', 'valid@email.com');
    });

    expect(result.current.errors.email).toBe(null);
    expect(result.current.isValid).toBe(true);
  });
});
```

## Accessibility Patterns

### 1. Keyboard Navigation Pattern

```typescript
// Keyboard navigation hook
const useKeyboardNavigation = (items: string[], onSelect: (item: string) => void) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        onSelect(items[focusedIndex]);
        break;
    }
  }, [items, focusedIndex, onSelect]);

  return { focusedIndex, handleKeyDown };
};

// Usage in dropdown component
const Dropdown = ({ items, onSelect }: DropdownPropTypes) => {
  const { focusedIndex, handleKeyDown } = useKeyboardNavigation(items, onSelect);

  return (
    <ul role="listbox" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item}
          role="option"
          aria-selected={index === focusedIndex}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
```

### 2. Screen Reader Pattern

```typescript
// Screen reader announcements
const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
};

// Usage
const MyComponent = () => {
  const { announce } = useScreenReader();

  const handleSave = async () => {
    try {
      await saveData();
      announce('Data saved successfully');
    } catch (error) {
      announce('Error saving data', 'assertive');
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
};
```

These patterns provide a solid foundation for building maintainable, accessible, and performant React components in the Image Builder Frontend project. Follow these patterns to ensure consistency and quality across the codebase.
