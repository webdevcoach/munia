import { useToggleState } from 'react-stately';
import {
  AriaSwitchProps,
  useFocusRing,
  useSwitch,
  VisuallyHidden,
} from 'react-aria';
import { useRef } from 'react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface SwitchProps extends AriaSwitchProps {
  children?: React.ReactNode;
}

export function Switch({ children, ...props }: SwitchProps) {
  let state = useToggleState(props);
  let ref = useRef(null);
  let { inputProps } = useSwitch(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center',
        props.isDisabled && 'opacity-40',
      )}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <div
        className={cn(
          'flex h-9 w-16 rounded-[40px] p-[2px] hover:opacity-90',
          props.isSelected
            ? 'justify-end bg-primary-accent'
            : 'justify-start bg-muted',
          isFocusVisible && 'ring-2 ring-violet-500 ring-offset-2',
        )}
      >
        <motion.div
          layout
          transition={spring}
          className={cn(
            'h-8 w-8 rounded-[200px]',
            props.isSelected ? 'bg-primary-foreground' : 'bg-muted-foreground',
          )}
        ></motion.div>
      </div>
      {children}
    </label>
  );
}

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30,
};