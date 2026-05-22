import { useState } from 'react';
import Button from '../ui/Button.jsx';
import { cn } from '../../lib/utils.js';

const CommentForm = ({ onSubmit, loading, placeholder = 'Write a comment... (Markdown supported)', onCancel, defaultValue = '' }) => {
  const [body, setBody] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit(body.trim());
    if (!defaultValue) setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="input resize-none text-sm"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" loading={loading} disabled={!body.trim()}>
          {defaultValue ? 'Update' : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
