import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarBlank, X } from '@phosphor-icons/react';
import Button from '../ui/Button.jsx';
import TagPill from '../ui/TagPill.jsx';
import { useTags } from '../../hooks/useTags.js';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(10000).default(''),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  dueDate: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

const TaskForm = ({ defaultValues, onSubmit, loading, submitLabel = 'Save', columns }) => {
  const { data: allTags = [] } = useTags();

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'todo',
      dueDate: '',
      tags: [],
      ...defaultValues,
    },
  });

  const selectedTags = watch('tags');
  const watchedDueDate = watch('dueDate');

  const toggleTag = (tagId) => {
    const next = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : [...selectedTags, tagId];
    setValue('tags', next);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Title *</label>
        <input {...register('title')} className="input" placeholder="Task title" />
        {errors.title && <p className="mt-1 text-xs text-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="input resize-none"
          placeholder="Supports **Markdown**..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
          <select {...register('priority')} className="input">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Column</label>
          <select {...register('status')} className="input">
            {columns?.length ? (
              columns.map((col) => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))
            ) : (
              <>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
        <div className="relative">
          <CalendarBlank
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="date"
            {...register('dueDate')}
            className="input pl-9 pr-9"
          />
          {watchedDueDate && (
            <button
              type="button"
              onClick={() => setValue('dueDate', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear date"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {allTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <TagPill
                key={tag._id}
                tag={tag}
                active={selectedTags.includes(tag._id)}
                onClick={() => toggleTag(tag._id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
