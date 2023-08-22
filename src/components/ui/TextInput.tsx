'use client';
import { cn } from '@/lib/cn';
import { SVGProps, forwardRef, useRef } from 'react';
import { AriaTextFieldOptions, useTextField } from 'react-aria';
import { v4 as uuidv4 } from 'uuid';

interface TextInputProps extends AriaTextFieldOptions<'input'> {
  className?: string;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  error?: string;
  width?: string | number;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, Icon, error, width, ...rest }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || localRef;
    let { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(rest, localRef);

    const id = uuidv4();
    return (
      <div className="relative block">
        {Icon && (
          <div className="absolute left-5 top-[50%] translate-y-[-50%]">
            <Icon
              className={cn(error ? 'stroke-red-900' : 'stroke-gray-500')}
              width={24}
              height={24}
            />
          </div>
        )}
        <input
          className={cn(
            'peer rounded-2xl bg-slate-100 pb-2 pr-5 pt-8 outline-none ring-black focus:ring-2',
            Icon ? 'pl-16' : 'pl-5',
            error && 'bg-red-200 ring-2 ring-red-900',
            className,
          )}
          style={{ width: width || '320px' }}
          id={id}
          {...inputProps}
          ref={inputRef}
          placeholder=" "
        />
        <label
          className={cn(
            'absolute top-[9px] z-0 translate-y-0 cursor-text text-sm transition-all peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-lg peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-sm',
            Icon ? 'left-16' : 'left-5',
            error ? 'text-red-900' : 'text-gray-500',
          )}
          htmlFor={id}
          {...labelProps}
        >
          {rest.label}
        </label>
        {error && (
          <p className="mt-2 font-semibold text-red-800" {...errorMessageProps}>
            {error}
          </p>
        )}
      </div>
    );
  },
);
