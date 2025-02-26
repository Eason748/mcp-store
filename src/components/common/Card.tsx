import React from 'react';

interface ICardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  isInteractive?: boolean;
}

export const Card: React.FC<ICardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
  variant = 'default',
  isInteractive = false,
}) => {
  const variantStyles = {
    default: 'bg-white shadow-card border border-neutral-200',
    outlined: 'bg-white border border-neutral-200',
    elevated: 'bg-white shadow-lg',
    glass: 'bg-white/70 backdrop-blur-md border border-white/20',
  };
  
  const paddingStyles = {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover'
    : '';

  const interactiveStyles = isInteractive
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
    : '';

  return (
    <div
      className={`
        rounded-xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${interactiveStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick || isInteractive ? 'button' : undefined}
      tabIndex={onClick || isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// Card subcomponents for consistent structure
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}> = ({ children, className = '', withBorder = false }) => (
  <div className={`mb-4 ${withBorder ? 'pb-4 border-b border-neutral-200' : ''} ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}> = ({ children, className = '', as = 'h3' }) => {
  const Component = as;
  const baseStyles = 'font-semibold text-neutral-900';
  
  const sizeStyles = {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-xl',
    h4: 'text-lg',
    h5: 'text-base',
    h6: 'text-sm',
  };
  
  return (
    <Component className={`${baseStyles} ${sizeStyles[as]} ${className}`}>
      {children}
    </Component>
  );
};

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm text-neutral-600 ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}> = ({ children, className = '', withBorder = false }) => (
  <div className={`mt-4 ${withBorder ? 'pt-4 border-t border-neutral-200' : ''} ${className}`}>
    {children}
  </div>
);

// Example usage:
/*
<Card hoverable onClick={() => {}} variant="elevated">
  <CardHeader withBorder>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>This is a description of the card</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter withBorder>
    Footer content
  </CardFooter>
</Card>
*/
