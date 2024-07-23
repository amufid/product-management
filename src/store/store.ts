import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
   categoryId: number;
   setData: (categoryId: number) => void;
}

export const useStore = create<AppState>()(
   persist(
      (set) => ({
         categoryId: 0,
         setData: (categoryId: number) => set(() => ({ categoryId })),
      }),
      {
         name: 'product',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({ categoryId: state.categoryId }),
      }
   )
);
