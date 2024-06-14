// ErrorHandling.tsx
import React from 'react';

export const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = (error: Error, info: { componentStack: string }) => {
    console.error("Caught an error in error boundary: ", error, info);
    setHasError(true);
  };

  return hasError ? <h1>Something went wrong.</h1> : children;
};
