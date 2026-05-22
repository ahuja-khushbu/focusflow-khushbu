import { cn } from '../../lib/utils.js';

const Card = ({ children, className, onClick, ...props }) => (
  <div
    className={cn(
      'bg-surface rounded-lg border border-border-warm shadow-sm',
      onClick && 'cursor-pointer hover:shadow-md hover:border-copper-light transition-all duration-150',
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

export default Card;
