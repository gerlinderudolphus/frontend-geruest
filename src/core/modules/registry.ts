import { create } from "zustand";
import type { AppModule } from "./types";

type ModuleState = {
  modules: AppModule[];
  openIds: string[];
  register: (modules: AppModule[]) => void;
  toggle: (id: string) => void;
  isOpen: (id: string) => boolean;
};

export const useModuleRegistry = create<ModuleState>((set, get) => ({
  modules: [],
  openIds: [],
  register(modules) {
    set({
      modules,
      openIds: modules.filter((module) => module.defaultOpen).map((module) => module.id),
    });
  },
  toggle(id) {
    const open = get().openIds.includes(id);
    set({
      openIds: open ? get().openIds.filter((item) => item !== id) : [...get().openIds, id],
    });
  },
  isOpen(id) {
    return get().openIds.includes(id);
  },
}));
