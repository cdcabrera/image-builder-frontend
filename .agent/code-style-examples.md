# Code Style Examples

This document provides concrete examples of the coding patterns and styles used in the Image Builder Frontend project.

## Component Examples

### Basic Functional Component

```typescript
import React from 'react';

import { Button } from '@patternfly/react-core';

type MyComponentPropTypes = {
  title: string;
  isLoading?: boolean;
  onSubmit: (data: string) => void;
};

const MyComponent = ({ title, isLoading = false, onSubmit }: MyComponentPropTypes) => {
  const handleClick = () => {
    onSubmit('example data');
  };

  return (
    <div>
      <h2>{title}</h2>
      <Button 
        variant="primary" 
        isLoading={isLoading}
        onClick={handleClick}
      >
        Submit
      </Button>
    </div>
  );
};

export default MyComponent;
```

### Component with Hooks

```typescript
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserData } from '../store/userSlice';

type UserProfilePropTypes = {
  userId: string;
};

const UserProfile = ({ userId }: UserProfilePropTypes) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth } = useChrome();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { userData, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth?.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
  }, [auth]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserData(userId));
    }
  }, [dispatch, isAuthenticated, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{userData?.name}</h1>
      <button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default UserProfile;
```

## Redux Toolkit Examples

### Slice Definition

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;
```

### RTK Query API Definition

```typescript
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from './baseQuery';

interface Image {
  id: string;
  name: string;
  status: 'building' | 'ready' | 'failed';
  created_at: string;
}

interface CreateImageRequest {
  name: string;
  distribution: string;
  architecture: string;
}

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery,
  tagTypes: ['Image'],
  endpoints: (builder) => ({
    getImages: builder.query<Image[], void>({
      query: () => '/images',
      providesTags: ['Image'],
    }),
    getImage: builder.query<Image, string>({
      query: (id) => `/images/${id}`,
      providesTags: (result, error, id) => [{ type: 'Image', id }],
    }),
    createImage: builder.mutation<Image, CreateImageRequest>({
      query: (newImage) => ({
        url: '/images',
        method: 'POST',
        body: newImage,
      }),
      invalidatesTags: ['Image'],
    }),
    deleteImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Image'],
    }),
  }),
});

export const {
  useGetImagesQuery,
  useGetImageQuery,
  useCreateImageMutation,
  useDeleteImageMutation,
} = imageApi;
```

## Custom Hook Examples

### Data Fetching Hook

```typescript
import { useEffect, useState } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useApi = <T>(url: string): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};
```

### Debounce Hook

```typescript
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage example
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

## Testing Examples

### Component Testing

```typescript
import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { store } from '../store';
import MyComponent from './MyComponent';

// Mock external dependencies
vi.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ name: 'Test User' }),
    },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('MyComponent', () => {
  it('renders with correct title', () => {
    renderWithProviders(
      <MyComponent 
        title="Test Title" 
        onSubmit={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onSubmit when button is clicked', async () => {
    const mockOnSubmit = vi.fn();
    
    renderWithProviders(
      <MyComponent 
        title="Test Title" 
        onSubmit={mockOnSubmit} 
      />
    );
    
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('example data');
    });
  });

  it('shows loading state', () => {
    renderWithProviders(
      <MyComponent 
        title="Test Title" 
        isLoading={true}
        onSubmit={vi.fn()} 
      />
    );
    
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useApi } from './useApi';

// Mock fetch
global.fetch = vi.fn();

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useApi('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Network error');
  });
});
```

## Utility Function Examples

### Type Guards

```typescript
// Type guard for checking if value is defined
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

// Type guard for API responses
interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export const isSuccessResponse = (response: ApiResponse): response is ApiResponse & { data: unknown } => {
  return response.success && isDefined(response.data);
};

// Usage
const handleApiResponse = (response: ApiResponse) => {
  if (isSuccessResponse(response)) {
    // TypeScript knows response.data is defined here
    console.log('Success:', response.data);
  } else {
    console.log('Error:', response.error);
  }
};
```

### Date Utilities

```typescript
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const isExpired = (expirationDate: string): boolean => {
  return new Date(expirationDate) < new Date();
};

export const getTimeUntilExpiration = (expirationDate: string): string => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffMs = expiry.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'Expired';
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  
  return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
};
```

## Import/Export Patterns

### Barrel Exports (index.ts files)

```typescript
// src/Components/index.ts
export { default as MyComponent } from './MyComponent/MyComponent';
export { default as AnotherComponent } from './AnotherComponent/AnotherComponent';
export * from './sharedComponents';

// src/Hooks/index.ts
export { useApi } from './useApi';
export { useDebounce } from './useDebounce';
export { default as useCustomHook } from './useCustomHook';

// src/Utilities/index.ts
export * from './typeGuards';
export * from './dateUtils';
export * from './formatters';
```

### Import Ordering

```typescript
// 1. React imports (always first)
import React, { useEffect, useState } from 'react';

// 2. External library imports (alphabetical)
import { Button, Card, CardBody } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

// 3. Internal imports (alphabetical)
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchData } from '../../store/dataSlice';
import { formatDate, isExpired } from '../../Utilities';

// 4. Relative imports
import './MyComponent.scss';
import { MyComponentProps } from './types';
```

## Error Handling Patterns

### Error Boundary

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Send to error reporting service
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Async Error Handling

```typescript
import { useState } from 'react';

interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T | null>;
}

export const useAsync = <T>(
  asyncFunction: (...args: unknown[]) => Promise<T>
): UseAsyncResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: unknown[]): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
```

These examples demonstrate the coding patterns, styles, and best practices used throughout the Image Builder Frontend project. Follow these patterns when contributing to the codebase to maintain consistency and quality.
