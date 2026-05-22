import { ClipboardText } from '@phosphor-icons/react';

const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-surface-warm flex items-center justify-center mb-4">
      <ClipboardText size={32} className="text-text-muted" />
    </div>
    <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
    {description && <p className="text-text-muted text-sm mb-4 max-w-xs">{description}</p>}
    {action && action}
  </div>
);

export default EmptyState;
