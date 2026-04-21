import { create } from "zustand";

export const useSessionStore = create((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session, loading: false }),

  clearSession: () => set({ session: null, loading: false }),
}));
