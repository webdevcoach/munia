import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { useDialogs } from '@/hooks/useDialogs';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SVGProps } from 'react';
import { Badge } from './ui/Badge';

export function MenuBarItem({
  children,
  Icon,
  route,
  badge,
}: {
  children: React.ReactNode;
  className?: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  route: string;
  badge?: number;
}) {
  const router = useRouter();
  const [isActive] = useActiveRouteChecker(route);
  const { confirm } = useDialogs();

  return (
    <div
      className={cn([
        'group relative flex h-14 flex-1 cursor-pointer flex-row items-center justify-center px-4 duration-300 hover:bg-violet-200 md:mt-2 md:flex-none md:rounded-lg md:last:mt-auto',
      ])}
      onClick={() => {
        if (route === '/api/auth/signout') {
          confirm({
            title: 'Confirm Logout',
            message: 'Do you really wish to logout?',
            onConfirm: () => signOut({ callbackUrl: '/' }),
          });
        } else {
          router.push(route);
        }
      }}
    >
      <div
        className={cn(
          'absolute left-0 hidden h-10 w-[4px] scale-y-0 rounded-r-lg bg-violet-700 transition-transform group-hover:scale-y-100 md:block',
          isActive && 'scale-y-100',
        )}
      ></div>
      <div
        className={cn(
          'absolute bottom-0 h-[4px] w-[70%] scale-x-0 rounded-t-lg bg-violet-700 transition-transform group-hover:scale-x-100 md:hidden',
          isActive && 'scale-x-100',
        )}
      ></div>
      <div className="relative md:mr-3">
        <Icon className="h-6 w-6 stroke-gray-700" />
        {badge !== undefined && badge !== 0 && (
          <div className="absolute right-[-25%] top-[-50%]">
            <Badge>{badge}</Badge>
          </div>
        )}
      </div>
      <p
        className={cn(
          'hidden text-base text-gray-700 transition-colors duration-300 group-hover:text-violet-700 md:block',
          isActive && 'text-violet-700',
        )}
      >
        {children}
      </p>
    </div>
  );
}