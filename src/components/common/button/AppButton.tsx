import React, { ReactNode } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
// Import SCSS module to make CSS custom properties available globally
import './appButton.module.scss';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline';

export interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  children: ReactNode;
  variant?: AppButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  to?: string;
}

// Styled button component using CSS custom properties from SCSS
const StyledButton = styled(Button)<{ appVariant: AppButtonVariant }>(({ appVariant }) => {
  const baseStyles = {
    padding: `var(--app-button-padding-y) var(--app-button-padding-x)`,
    borderRadius: `var(--app-button-radius)`,
    fontWeight: 600,
    lineHeight: 1.1,
    textTransform: 'none' as const,
    transition: `var(--app-button-transition)`,
    gap: `var(--app-button-gap)`,
    '&:disabled': {
      opacity: 1,
      cursor: 'not-allowed',
    },
  };

  switch (appVariant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: `var(--app-button-primary)`,
        color: `var(--app-button-white)`,
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: `var(--app-button-primary-darken)`,
        },
        '&:disabled': {
          ...baseStyles['&:disabled'],
          backgroundColor: `rgba(var(--app-button-primary-rgb), 0.3)`,
          color: `rgba(var(--app-button-primary-rgb), 0.6)`,
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 3px rgba(var(--app-button-primary-rgb), 0.45)`,
        },
      };

    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: `var(--app-button-secondary)`,
        color: `var(--app-button-white)`,
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: `var(--app-button-secondary-darken)`,
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 3px rgba(var(--app-button-secondary-rgb), 0.45)`,
        },
      };

    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        border: `1px solid var(--app-button-primary)`,
        color: `var(--app-button-primary)`,
        '&:hover': {
          backgroundColor: `rgba(var(--app-button-primary-rgb), 0.1)`,
          borderColor: `var(--app-button-primary)`,
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 3px rgba(var(--app-button-primary-rgb), 0.25)`,
        },
      };

    default:
      return baseStyles;
  }
});

const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  className,
  ...otherProps
}) => {
  return (
    <StyledButton
      appVariant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      startIcon={startIcon}
      endIcon={endIcon}
      className={className}
      {...otherProps}
    >
      {children}
    </StyledButton>
  );
};

export default AppButton;

