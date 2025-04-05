import React, { useState, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div>Something went wrong.</div>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    setHasError(true);
    return <div>Something went wrong.</div>;
  }
};

export default ErrorBoundary;
