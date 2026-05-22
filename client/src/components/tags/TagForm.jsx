import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button.jsx';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color').default('#D97757'),
});

const PRESET_COLORS = [
  '#D97757', '#E8A87C', '#4CAF79', '#3B82F6',
  '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6',
];

const TagForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', color: '#D97757' },
  });

  const color = watch('color');
  const name = watch('name');

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Tag Name</label>
        <input
          type="text"
          {...register('name')}
          className="input"
          placeholder="e.g. Frontend"
        />
        {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue('color', c)}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? '#1A1A1A' : 'transparent',
                }}
              />
            ))}
          </div>
          <input
            type="color"
            {...register('color')}
            className="w-8 h-8 rounded cursor-pointer border border-border-warm"
          />
        </div>
        {errors.color && <p className="mt-1 text-xs text-error">{errors.color.message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: color + '22', color, border: `1px solid ${color}66` }}
        >
          {name || 'Preview'}
        </span>
        <Button type="submit" loading={loading}>
          Create Tag
        </Button>
      </div>
    </form>
  );
};

export default TagForm;
