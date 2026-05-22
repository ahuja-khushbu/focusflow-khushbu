import { useTags, useCreateTag, useDeleteTag } from '../../hooks/useTags.js';
import TagForm from './TagForm.jsx';
import Spinner from '../ui/Spinner.jsx';
import Button from '../ui/Button.jsx';

const TagManager = () => {
  const { data: tags = [], isLoading } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Create Tag</h2>
        <TagForm
          onSubmit={(data) => createTag.mutate(data)}
          loading={createTag.isPending}
        />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Your Tags <span className="text-text-muted font-normal text-sm">({tags.length})</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : tags.length === 0 ? (
          <p className="text-text-muted text-sm">No tags yet. Create one above.</p>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag._id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-warm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="font-medium text-text-primary text-sm">{tag.name}</span>
                  <span className="text-xs text-text-muted">{tag.taskCount ?? 0} tasks</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTag.mutate(tag._id)}
                  className="text-error hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagManager;
