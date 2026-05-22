import { useState } from 'react';
import Button from '../ui/Button.jsx';

const PRESET_COLORS = [
  '#D97757', '#E8A87C', '#4CAF79', '#3B82F6',
  '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6',
];

const TagForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#D97757');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Tag Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="e.g. Frontend"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
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
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border-warm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: color + '22', color, border: `1px solid ${color}66` }}
        >
          {name || 'Preview'}
        </span>
        <Button type="submit" loading={loading} disabled={!name.trim()}>
          Create Tag
        </Button>
      </div>
    </form>
  );
};

export default TagForm;
