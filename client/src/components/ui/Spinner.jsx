import { cn } from '../../lib/utils.js';

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
};

const Spinner = ({ size = 'md', className }) => (
  <div
    className={cn(
      'border-copper border-t-transparent rounded-full animate-spin',
      sizes[size],
      className
    )}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
