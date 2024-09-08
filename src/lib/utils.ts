import { generateSidelinks, SideLink } from "@/data/sidelinks";
import { useAuthStore } from "@/store/authStore";
import { type ClassValue, clsx } from "clsx"
import { useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + ' Triliun';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + ' Milyar';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + ' Juta';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + ' Ribu';
  }
  return num.toString();
}

function flattenSidelinks(sidelinks: SideLink[]): string[] {
  return sidelinks.reduce((acc: string[], item: SideLink) => {
    if (item.href) {
      acc.push(item.href);
    }
    if (item.sub) {
      acc.push(...flattenSidelinks(item.sub));
    }
    return acc;
  }, []);
}

export function getUserRoutes(): string[] {
  const userAuthorization = useAuthStore(state => state.userAuthorization);

  if (!userAuthorization) {
    return [];
  }

  const sidelinks = generateSidelinks(userAuthorization);
  return flattenSidelinks(sidelinks);
}

export function hasRouteAccess(route: string): boolean {
  const userRoutes = getUserRoutes();
  return userRoutes.includes(route);
}

export const useLocalStorage = <T>(
  keyName: string,
  defaultValue: T,
): [T, (newValue: T | null) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(keyName);
      // Parse stored json or if none return defaultValue
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });

  const setValue = (newValue: T | null): void => {
    try {
      if (newValue === null || newValue === undefined) {
        window.localStorage.removeItem(keyName);
        setStoredValue(defaultValue);
      } else {
        const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue;
        setStoredValue(valueToStore);
        window.localStorage.setItem(keyName, JSON.stringify(valueToStore));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
};
