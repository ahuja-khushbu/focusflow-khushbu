import { MagnifyingGlass, X } from '@phosphor-icons/react';
import useFilterStore from '../../store/filterStore.js';
import { useTags } from '../../hooks/useTags.js';
import TagPill from '../ui/TagPill.jsx';
import Button from '../ui/Button.jsx';

const TaskFilters = () => {
  const { data: tags = [] } = useTags();
  const {
    activeTags, toggleTag,
    activeStatus, setActiveStatus,
    activePriority, setActivePriority,
    searchQuery, setSearchQuery,
    resetFilters,
  } = useFilterStore();

  const hasFilters = activeTags.length || activeStatus || activePriority || searchQuery;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-9"
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center gap-1.5">
            <X size={14} />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={activeStatus}
          onChange={(e) => setActiveStatus(e.target.value)}
          className="text-sm border border-border-warm rounded px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-copper"
        >
          <option value="">All status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={activePriority}
          onChange={(e) => setActivePriority(e.target.value)}
          className="text-sm border border-border-warm rounded px-2 py-1.5 bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-copper"
        >
          <option value="">All priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {tags.map((tag) => (
          <TagPill
            key={tag._id}
            tag={tag}
            active={activeTags.includes(tag._id)}
            onClick={() => toggleTag(tag._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;
