'use client';
import { cn } from '@/lib/cn';
import { SVGProps } from 'react';

type Sizes = 'huge' | 'large' | 'medium' | 'small' | 'long';
export default function Button({
  children,
  mode = 'primary',
  size = 'medium',
  Icon,
  shape = 'rounded',
  disabled = false,
  onClick,
}: {
  children?: React.ReactNode;
  mode?: 'primary' | 'secondary' | 'ghost';
  size?: Sizes;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  shape?: 'pill' | 'rounded';
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const sizes = {
    huge: 'px-8 py-5 gap-4 text-lg rounded-2xl',
    large: 'px-8 py-5 gap-4 text-base rounded-xl',
    medium: 'px-6 py-4 gap-3 text-base rounded-xl',
    small: 'px-4 py-2 gap-3 text-sm rounded-lg',
    long: 'px-16 py-3 gap-3 text-base rounded-xl',
  };
  const modes = {
    primary:
      'bg-violet-600 dark:bg-violet-400 text-white dark:text-violet-800 hover:bg-violet-700 dark:hover:bg-violet-300 active:ring-8 ring-violet-400 dark:active:ring-violet-900',
    secondary:
      'border-2 border-violet-600 dark:border-violet-400 text-violet-600 dark:text-violet-400 hover:border-violet-800 dark:hover:border-violet-300 hover:text-violet-800 dark:hover:text-violet-300 active:ring-8 ring-violet-400 dark:active:ring-violet-900',
    ghost: 'font-semibold text-gray-600 hover:text-gray-900',
  };
  const iconModes = {
    primary: 'stroke-white dark:stroke-violet-800',
    secondary:
      'stroke-violet-600 dark:stroke-violet-400 group-hover:stroke-violet-800 dark:group-hover:stroke-violet-300',
    ghost: 'stroke-gray-600',
  };

  return (
    <button
      className={cn([
        'flex flex-row items-center justify-center font-semibold group',
        mode !== 'ghost' && sizes[size],
        modes[mode],
        shape === 'pill' && 'rounded-full',
        disabled && 'opacity-50',
      ])}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {Icon && (
        <Icon
          width={24}
          height={24}
          className={cn([size === 'small' && 'scale-75', iconModes[mode]])}
        />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}