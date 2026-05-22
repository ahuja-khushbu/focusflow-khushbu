import TagManager from '../../components/tags/TagManager.jsx';
import Navbar from '../../components/layout/Navbar.jsx';

const TagsPage = () => (
  <div className="min-h-screen bg-bg-base">
    <Navbar />
    <main className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Tags</h1>
        <p className="text-text-secondary text-sm mt-1">Organize your tasks with colored tags</p>
      </div>
      <TagManager />
    </main>
  </div>
);

export default TagsPage;
