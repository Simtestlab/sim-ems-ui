"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useNavigationStore from "./useNavigationStore";

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  const setPathname = useNavigationStore((s) => s.setPathname);
  const setQuery = useNavigationStore((s) => s.setQuery);

  useEffect(() => {
    setPathname(pathname);
  }, [pathname, setPathname]);

  useEffect(() => {
    const q: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => {
        q[key] = value;
      });
    }
    setQuery(q);
  }, [searchParams, setQuery]);

  const push = (path: string) => router.push(path);
  const replace = (path: string) => router.replace(path);

  const pushWithQuery = (path: string, query: Record<string, string>) => {
    const qs = new URLSearchParams(query).toString();
    router.push(`${path}${qs ? `?${qs}` : ""}`);
  };

  const state = useNavigationStore();

  return useMemo(
    () => ({
      pathname: state.pathname,
      query: state.query,
      push,
      replace,
      pushWithQuery,
      setParam: useNavigationStore.getState().setParam,
    }),
    [state.pathname, state.query]
  );
}

export default useNavigation;
