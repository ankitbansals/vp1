import { create } from 'zustand';

type MegaMenuStore = {
  openCategory: string;
  selectedCategory: string | null;
  setOpenCategory: (category: string) => void;
  setSelectedCategory: (category: string | null) => void;
};

export const useMegaMenuStore = create<MegaMenuStore>((set) => ({
  openCategory: '',
  selectedCategory: null,
  setOpenCategory: (category: string) => set({ openCategory: category }),
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
}));
