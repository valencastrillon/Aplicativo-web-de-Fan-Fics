import { useSyncExternalStore } from "react";
// Obras guardadas y que me gustan, persistidas en este navegador.
type Kind = "saved" | "liked" | "read" | "followed";
const key = (k: Kind) => `nocturna-${k}`;
const read = (k: Kind): string[] => { try { return JSON.parse(localStorage.getItem(key(k)) || "[]"); } catch { return []; } };
const cache: Record<Kind, string[]> = { saved: read("saved"), liked: read("liked"), read: read("read"), followed: read("followed") };
const subs = new Set<() => void>();
export const toggleIn = (k: Kind, id: string) => {
  cache[k] = cache[k].includes(id) ? cache[k].filter((x) => x !== id) : [...cache[k], id];
  localStorage.setItem(key(k), JSON.stringify(cache[k]));
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const useList = (k: Kind) => useSyncExternalStore(subscribe, () => cache[k]);
export const chapterKey = (story: string, n: number) => `${story}:${n}`;
export const markRead = (story: string, n: number) => { if (!cache.read.includes(chapterKey(story, n))) toggleIn("read", chapterKey(story, n)); };
export const followedNow = () => cache.followed;
