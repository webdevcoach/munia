'use client';
import { SVGProps, useContext } from 'react';
import {
  CircleActionsAlertInfo,
  CircleActionsClose,
  CircleActionsSuccess,
  NotificationBell,
} from '@/svg_components';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ToastContextData } from '@/contexts/ToastContext';

export function Toast() {
  const { shown, toast } = useContext(ToastContextData);
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className={cn(
            'w-80 fixed z-40 bottom-20 md:bottom-6 right-6 p-6 rounded-xl',
            colors[toast.type!].bg
          )}
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 48 }}
        >
          <div className="flex items-center gap-4">
            {icons[toast.type!].renderComponent({
              width: 24,
              height: 24,
              className: colors[toast.type!].icon,
            })}
            <h3
              className={cn('text-lg font-semibold', colors[toast.type!].text)}
            >
              {toast.title}
            </h3>
          </div>
          {toast.message && (
            <p className="text-sm text-gray-700 ml-10">{toast.message}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const colors = {
  default: {
    bg: 'bg-violet-200',
    text: 'text-violet-700',
    icon: 'stroke-violet-700',
  },
  success: {
    bg: 'bg-green-200',
    text: 'text-green-700',
    icon: 'stroke-green-700',
  },
  warning: {
    bg: 'bg-yellow-200',
    text: 'text-yellow-700',
    icon: 'stroke-yellow-700',
  },
  error: {
    bg: 'bg-pink-200',
    text: 'text-red-700',
    icon: 'stroke-red-700',
  },
};

const icons = {
  default: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <NotificationBell {...props} />
    ),
  },
  success: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <CircleActionsSuccess {...props} />
    ),
  },
  warning: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <CircleActionsAlertInfo {...props} />
    ),
  },
  error: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <CircleActionsClose {...props} />
    ),
  },
};