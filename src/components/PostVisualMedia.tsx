import { cn } from '@/lib/cn';
import { Play } from '@/svg_components';
import { VisualMediaType } from '@prisma/client';
import { mergeProps, useFocusRing, usePress } from 'react-aria';

export default function PostVisualMedia({
  type,
  url,
  onClick,
  height,
  colSpan,
}: {
  type: VisualMediaType;
  url: string;
  onClick: () => void;
  height: string;
  colSpan: number;
}) {
  const { pressProps, isPressed } = usePress({
    onPress: onClick,
  });
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      {...mergeProps(pressProps, focusProps)}
      role="button"
      tabIndex={0}
      className={cn(
        'group relative cursor-pointer focus:outline-none',
        colSpan === 1 ? 'col-span-1' : 'col-span-2',
        isFocusVisible && 'border-4 border-violet-500',
      )}
      style={{
        height,
      }}
    >
      {type === 'PHOTO' ? (
        <img
          src={url}
          className={cn(
            'h-full w-full object-cover ',
            isPressed && 'brightness-75',
          )}
        />
      ) : (
        <>
          <Play
            width={72}
            height={72}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] stroke-violet-100 transition-transform group-hover:scale-125"
          />
          <video className="h-full w-full object-cover">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
}
