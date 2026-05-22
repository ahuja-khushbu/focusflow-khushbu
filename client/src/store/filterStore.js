import { create } from 'zustand';

const useFilterStore = create((set) => ({
  activeTags: [],
  activeStatus: '',
  activePriority: '',
  searchQuery: '',

  setActiveTags: (tags) => set({ activeTags: tags }),
  toggleTag: (tagId) =>
    set((s) => ({
      activeTags: s.activeTags.includes(tagId)
        ? s.activeTags.filter((t) => t !== tagId)
        : [...s.activeTags, tagId],
    })),
  setActiveStatus: (status) => set({ activeStatus: status }),
  setActivePriority: (priority) => set({ activePriority: priority }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  resetFilters: () =>
    set({ activeTags: [], activeStatus: '', activePriority: '', searchQuery: '' }),
}));

export default useFilterStore;
