import { cn } from '../../lib/utils.js';

const Avatar = ({ user, size = 'md', className }) => {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-copper text-white font-medium flex items-center justify-center flex-shrink-0',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
