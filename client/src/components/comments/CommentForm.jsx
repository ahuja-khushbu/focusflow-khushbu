import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button.jsx';

const schema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment is too long'),
});

const CommentForm = ({ onSubmit, loading, placeholder = 'Write a comment... (Markdown supported)', onCancel, defaultValue = '' }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { body: defaultValue },
  });

  const handleFormSubmit = ({ body }) => {
    onSubmit(body.trim());
    if (!defaultValue) reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
      <textarea
        {...register('body')}
        placeholder={placeholder}
        rows={3}
        className="input resize-none text-sm"
      />
      {errors.body && <p className="mt-1 text-xs text-error">{errors.body.message}</p>}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" loading={loading}>
          {defaultValue ? 'Update' : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
