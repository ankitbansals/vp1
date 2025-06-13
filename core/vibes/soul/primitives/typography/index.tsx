import clsx from "clsx";

// Simple Typography component
export function Typography({ 
  variant = 'body', 
  children, 
  className = '', 
  as: Component = 'p' 
}: {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-small' | 'caption';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const variantClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    body: 'text-base',
    'body-small': 'text-sm',
    caption: 'text-xs',
  };

  return (
    <Component className={clsx(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}