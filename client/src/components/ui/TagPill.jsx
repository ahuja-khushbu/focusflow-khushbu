import { cn } from '../../lib/utils.js';

const TagPill = ({ tag, onRemove, onClick, active = false }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all duration-150',
      onClick && 'cursor-pointer',
      active ? 'ring-2 ring-offset-1' : 'hover:opacity-90'
    )}
    style={{
      backgroundColor: tag.color + '22',
      borderColor: tag.color + '66',
      color: tag.color,
      '--tw-ring-color': tag.color,
    }}
    onClick={onClick}
  >
    {tag.name}
    {onRemove && (
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(tag._id); }}
        className="hover:opacity-70 transition-opacity ml-0.5"
        aria-label={`Remove tag ${tag.name}`}
      >
        ×
      </button>
    )}
  </span>
);

export default TagPill;
