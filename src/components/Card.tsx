import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type CardPadding = 'sm' | 'md' | 'lg';

type CardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

const paddingMap: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  padding = 'md',
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div';
  const paddingClass = paddingMap[padding] ?? paddingMap.md;
  const classes = ['rounded-xl bg-white shadow-sm', paddingClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
