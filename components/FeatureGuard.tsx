"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthPrompt } from '@/hooks/useAuthPrompt';
import { AuthPrompt } from '@/components/AuthPrompt';

interface FeatureGuardProps {
  children: React.ReactNode;
  featureName: string;
  requireAuth?: boolean;
}

export function FeatureGuard({ children, featureName, requireAuth = true }: FeatureGuardProps) {
  const { user } = useAuth();
  const { showPrompt, dismissPrompt, markUserInteraction } = useAuthPrompt();

  const handleFeatureAccess = () => {
    if (!user && requireAuth) {
      markUserInteraction(featureName);
      return false;
    }
    return true;
  };

  // Wrap clickable elements to check auth before access
  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          if (!handleFeatureAccess()) {
            e.preventDefault();
            return;
          }
          // Call original onClick if it exists
          if (child.props.onClick) {
            child.props.onClick(e);
          }
        }
      });
    }
    return child;
  });

  return (
    <>
      {wrappedChildren}
      {showPrompt && !user && (
        <AuthPrompt 
          onClose={dismissPrompt}
          showCloseButton={!requireAuth}
        />
      )}
    </>
  );
}
