"use client";

import create from "zustand";

type Query = Record<string, string>;

type NavState = {
  pathname: string;
  query: Query;
  setPathname: (p: string) => void;
  setQuery: (q: Query) => void;
  setParam: (key: string, value: string | null) => void;
};

export const useNavigationStore = create<NavState>((set) => ({
  pathname: "/",
  query: {},
  setPathname: (p: string) => set(() => ({ pathname: p })),
  setQuery: (q: Query) => set(() => ({ query: { ...q } })),
  setParam: (key: string, value: string | null) =>
    set((s) => {
      const next = { ...s.query };
      if (value === null) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return { query: next };
    }),
}));

export default useNavigationStore;
