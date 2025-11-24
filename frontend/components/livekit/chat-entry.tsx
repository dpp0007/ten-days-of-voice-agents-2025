import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  /** The locale to use for the timestamp. */
  locale: string;
  /** The timestamp of the message. */
  timestamp: number;
  /** The message to display. */
  message: string;
  /** The origin of the message. */
  messageOrigin: 'local' | 'remote';
  /** The sender's name. */
  name?: string;
  /** Whether the message has been edited. */
  hasBeenEdited?: boolean;
}

export const ChatEntry = ({
  name,
  locale,
  timestamp,
  message,
  messageOrigin,
  hasBeenEdited = false,
  className,
  ...props
}: ChatEntryProps) => {
  const time = new Date(timestamp);
  const title = time.toLocaleTimeString(locale, { timeStyle: 'full' });

  return (
    <li
      title={title}
      data-lk-message-origin={messageOrigin}
      className={cn('group flex w-full flex-col gap-0.5', className)}
      {...props}
    >
      <header
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-1.5',
          messageOrigin === 'local' ? 'flex-row-reverse' : 'text-left'
        )}
      >
        {name && (
          <strong className={cn(
            'font-semibold',
            messageOrigin === 'local' ? 'text-[#FF6B6B]' : 'text-[#10B981]'
          )}>
            {name}
          </strong>
        )}
        <span className="font-mono text-[10px] sm:text-xs text-gray-400 opacity-70 sm:opacity-0 transition-opacity ease-linear sm:group-hover:opacity-100">
          {hasBeenEdited && '*'}
          {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
        </span>
      </header>
      <div
        className={cn(
          'max-w-[85%] sm:max-w-[75%] rounded-[18px] sm:rounded-[20px] px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base break-words leading-relaxed shadow-sm',
          messageOrigin === 'local' 
            ? 'ml-auto bg-[#FF6B6B] text-white' 
            : 'mr-auto bg-gray-100 text-gray-900'
        )}
      >
        {message}
      </div>
    </li>
  );
};
