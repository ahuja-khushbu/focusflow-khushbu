import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      modalType: null,
      modalData: null,
      darkMode: false,

      openModal: (type, data = null) => set({ modalType: type, modalData: data }),
      closeModal: () => set({ modalType: null, modalData: null }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: 'focusflow-ui',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);

export default useUIStore;
